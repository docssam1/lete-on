export const unit = {
  "id": "c22-s42-fin",
  "course": "4-2",
  "no": null,
  "title": "기말평가 · 창작",
  "domain": "종합",
  "sources": {
    "basis": [
      "science-lab/bank/work/c22s42u01/curriculum.json",
      "science-lab/bank/work/c22s42u02/curriculum.json",
      "science-lab/bank/work/c22s42u03/curriculum.json",
      "science-lab/bank/work/c22s42u04/curriculum.json"
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
      "밤하늘 관찰",
      "생물과 환경",
      "여러 가지 기체",
      "기후변화와 우리 생활"
    ],
    "scopeNote": "1~4단원 학습용 구성·학교별 공식 시험 범위와 별개",
    "performanceNote": "실제 관찰·설계·제작·조사·실천·소통은 별도 확인한다."
  }
};
export const items = [
  {
    "id": "c22-s42-fin-f1-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 1,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "달 관찰 노트에 같은 달의 모양을 여러 날 그렸습니다. 관찰로 알아보려는 내용에 가장 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "날짜에 따라 보이는 달 모양의 변화",
      "구름 뒤 달이 완전히 없어지는 날짜",
      "달 표면의 모든 자국이 생긴 정확한 시각",
      "달의 실제 크기가 날짜마다 달라지는 양",
      "못 본 날까지 모양이 같았는지 확인한 결과"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "여러 날 관찰한 모양을 날짜와 함께 비교해요. 이 관찰만으로 표면 자국의 생성 시각이나 변화 원인까지 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 2,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "가상 달 관찰표를 읽은 설명 중 근거에 맞는 두 가지를 고르세요.",
    "givens": {
      "가상 관찰 자료": {
        "머리": [
          "날",
          "기록"
        ],
        "행": [
          [
            "1일",
            "가는 모양 직접 관찰"
          ],
          [
            "3일",
            "흐려 못 봄"
          ],
          [
            "6일",
            "반원에 가까운 모양 직접 관찰"
          ],
          [
            "8일",
            "관찰하지 못함"
          ]
        ],
        "caption": "가상 관찰 자료"
      }
    },
    "choices": [
      "네 날 모두 실제 달을 본 기록으로 센다.",
      "관찰하지 못한 날은 따로 표시해야 한다.",
      "관찰한 날의 모양 차이를 비교할 수 있다.",
      "흐린 날은 달이 없었다고 확인한 날이다.",
      "앞날 모양으로 못 본 날의 값을 채워도 된다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "직접 본 두 날의 기록을 비교할 수 있어요. 관찰하지 못한 두 날의 달 모양은 이 자료로 확인하지 못해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 3,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "달 표면을 찍은 교사 제공 사진에 움푹한 부분이 보입니다. 사진에서 확인한 표면의 특징을 고르세요. 기호만 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 움푹한 부분이 보인다. / ㄴ 그 부분이 오늘 생겼다. / ㄷ 그 부분을 손으로 만져 보았다."
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
    "explanation": "사진에서 보이는 움푹한 부분은 관찰 가능한 특징이에요. 생긴 날짜나 직접 만졌다는 사실은 사진만으로 확인할 수 없어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 4,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "달 그림 두 장에 날짜만 있고 시각·장소와 자료 출처가 없습니다. 비교 전에 무엇을 확인하고, 확인할 수 없는 내용은 어떻게 남길지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "직접 관찰인지 제공 사진인지 먼저 확인한다. 실제 관찰의 날짜·시각·장소·방향을 보완하고, 알 수 없는 조건과 못 본 모양은 미확인으로 남긴다.",
      "rubric": {
        "required": [
          "직접 관찰과 제공 자료 구별",
          "관찰 조건 확인·미확인 보존"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "그림이 있어도 실제 관찰 조건이 자동으로 증명되지는 않아요. 빠진 조건을 지어내어 채우지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 5,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "태양계 소개판의 “태양” 카드에 붙일 설명으로 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "달과 같은 종류의 위성이다.",
      "지구 둘레를 도는 행성이다.",
      "행성과 같은 종류의 천체이다.",
      "태양계의 아홉 번째 행성이다.",
      "스스로 빛을 내는 별이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "태양은 스스로 빛을 내는 별이에요. 행성·달·별자리를 태양과 같은 분류로 섞지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 6,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "태양계 구성원을 조사해 전시할 때 타당한 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "태양계 그림의 모든 천체를 행성으로 묶는다.",
      "행성은 빛이 보이니 모두 별이라고 소개한다.",
      "모형의 간격과 크기가 실제 축척인지 밝힌다.",
      "자료에서 지구가 행성임을 확인해 넣는다.",
      "크게 인쇄한 달은 태양보다 크다고 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "천체의 분류와 자료의 표현 범위를 확인해요. 축척이 명시되지 않은 모형의 크기·간격을 실제 비율로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 7,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "행성 카드가 수성·금성·지구·화성·목성·토성·천왕성·해왕성입니다. 이 카드 중 우리가 사는 행성의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지구",
      "accepted": [
        "지구"
      ]
    },
    "explanation": "우리가 사는 지구도 태양계의 행성이에요. 별인 태양이나 지구의 달과 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 8,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "모둠이 태양과 행성을 같은 크기의 원으로 나열했습니다. 이 전시로 알 수 있는 내용과, 원의 크기만으로 알 수 없는 내용을 각각 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "확인한 태양과 행성의 이름·구성원을 소개할 수 있다. 같은 크기의 원은 전시 약속이므로 실제 크기나 천체 사이 거리 비율을 나타냈다고 할 수 없다.",
      "rubric": {
        "required": [
          "구성원 소개 가능",
          "크기·거리의 실제 비율 미표현"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모형에서 표현한 속성과 생략한 속성을 구별해요. 이름을 배치했다고 실제 크기 관계도 맞는 것은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 9,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "별과 달·행성을 구분하는 설명 중 옳은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "달도 빛이 보이므로 반드시 별이다.",
      "밤하늘에서 움직이면 모두 별이다.",
      "별은 스스로 빛을 내는 천체이다.",
      "밝게 보이는 것은 모두 별이다.",
      "낮에는 별인 태양도 행성이 된다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "별의 기준은 스스로 빛을 낸다는 것이에요. 보이는 밝기나 관찰한 시간만으로 달·행성을 별로 분류하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 10,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "북쪽 하늘 관찰을 준비하는 계획 중 근거를 남기는 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "건물에 가린 별은 없어진 것으로 기록한다.",
      "다른 시각 그림을 내 실제 관찰로 복사한다.",
      "확인하지 않은 별 이름을 정답처럼 채운다.",
      "프로그램 화면과 실제 관찰 기록을 구별한다.",
      "관찰 위치에서 북쪽 방향을 확인한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "방향 기준과 관찰 방식·시각을 적어요. 가려진 곳이나 모르는 이름은 확인하지 못한 것으로 남겨요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 11,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "친구가 “스스로 빛을 내는 천체를 무엇이라고 하나요?”라고 묻습니다. 그 천체 종류를 한 낱말로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "별",
      "accepted": [
        "별"
      ]
    },
    "explanation": "이 단원에서 별은 스스로 빛을 내는 천체를 뜻해요. 밤에 보이는 모든 밝은 점을 무조건 별로 부르지는 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 12,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "북극성 주변 별자리 자료와 실제 관찰 그림의 방향이 달라 보입니다. 바로 틀렸다고 하기 전에 확인할 조건과 자료를 구별하는 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "관찰한 장소·시각과 북쪽 방향, 자료를 놓은 방향과 설정을 확인한다. 직접 본 별의 배치와 프로그램·교사 자료를 나누고 가림이나 미확인을 표시해 다시 비교한다.",
      "rubric": {
        "required": [
          "시각·방향·자료 설정 확인",
          "직접 관찰과 자료·미확인 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "자료를 돌려 놓았거나 시각·가림 조건이 다를 수 있어요. 모든 자료를 실제 관찰 결과로 바꾸어 쓰지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 13,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "논 생태계의 조사 목록 중 생물 요소끼리만 묶은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "벼와 개구리",
      "물과 개구리",
      "흙과 물",
      "햇빛과 흙",
      "햇빛과 벼"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "벼와 개구리는 생물 요소이고 물·햇빛·흙은 비생물 요소예요. 식물도 생물에 포함해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 14,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "생태계 구성 요소를 분류하는 방법 중 타당한 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "물·흙·빛 같은 비생물 요소도 기록한다.",
      "작은 생물은 생태계에 속하지 않는다고 한다.",
      "관찰표에 없는 요소는 어디에도 없다고 한다.",
      "동물뿐 아니라 식물도 생물 요소로 살핀다.",
      "움직이지 않는 생물은 모두 비생물로 옮긴다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "생태계에는 생물과 비생물 요소가 함께 있어요. 크기·움직임이나 조사 목록의 누락만으로 분류·존재를 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 15,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 연못 목록 “물·흙·물풀·붕어·잠자리”에서 생물 요소의 수를 숫자로 쓰세요.",
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
    "explanation": "물풀·붕어·잠자리 세 개가 생물 요소예요. 물과 흙은 비생물 요소로 분류해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 16,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "친구가 운동장 사진에서 움직이는 동물만 표시하고 생태계 조사를 끝냈습니다. 조사 범위와 분류를 어떻게 보완할지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "식물 등 다른 생물과 물·흙·빛 같은 비생물 요소를 함께 살핀다. 사진으로 확인한 장소·시점과 실제 조사한 범위를 적고 사진 밖 요소는 미확인으로 남긴다.",
      "rubric": {
        "required": [
          "생물·비생물 요소 함께 조사",
          "관찰 범위와 미확인 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "움직이는 동물만 찾으면 생태계 구성 요소가 빠져요. 사진 한 장으로 모든 요소의 존재 여부를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 17,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "가상 먹이 관계에서 토끼가 풀을 먹습니다. 화살표를 “먹이→먹는 생물”로 그린 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "토끼→물",
      "흙→토끼",
      "토끼→풀",
      "풀→토끼",
      "풀→햇빛"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "이 문제의 약속에 따르면 먹이인 풀에서 먹는 토끼로 화살표를 그어요. 물·햇빛은 먹이 관계표의 생물 먹이와 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 18,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "가상 먹이 관계표에 맞는 설명 두 가지를 고르세요.",
    "givens": {
      "가상 관찰 자료": {
        "머리": [
          "먹는 생물",
          "먹이"
        ],
        "행": [
          [
            "토끼",
            "풀"
          ],
          [
            "들쥐",
            "풀"
          ],
          [
            "매",
            "토끼·들쥐"
          ]
        ],
        "caption": "가상 관찰 자료"
      }
    },
    "choices": [
      "매의 대체 먹이가 있으면 생존이 보장된다.",
      "매는 토끼와 들쥐 양쪽에 연결된다.",
      "들쥐가 토끼를 먹는다고 표에 나와 있다.",
      "이 표만으로 모든 생물의 개체수를 안다.",
      "풀에서 토끼와 들쥐로 경로가 갈라진다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "여러 먹이 관계를 한 그물로 연결해요. 제시되지 않은 먹이 관계나 정확한 개체수·생존 보장은 이 자료의 결론이 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 19,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 관계 “풀→메뚜기→개구리, 풀→들쥐→뱀, 개구리→뱀”에서 개구리와 들쥐를 모두 먹는 생물을 쓰세요. 화살표는 먹이에서 먹는 생물로 향합니다.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "뱀",
      "accepted": [
        "뱀"
      ]
    },
    "explanation": "개구리→뱀과 들쥐→뱀을 함께 확인하면 뱀이 두 생물을 먹어요. 제시한 가상 관계 안에서 답해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 20,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "제시한 가상 관계를 화살표로 연결해 먹이그물을 표현하고, 풀이 줄었다는 사실만으로 다른 생물의 정확한 수를 확정할 수 없는 까닭을 쓰세요.",
    "givens": {
      "연습 자료": "토끼와 들쥐는 풀을 먹고 매는 토끼와 들쥐를 먹는 가상 자료다. 화살표는 먹이에서 먹는 생물로 향한다."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "풀→토끼→매와 풀→들쥐→매를 함께 연결한다. 풀 감소가 먹이 관계에 영향을 줄 수 있지만 다른 먹이·환경·이동 등의 자료가 없으므로 모든 개체수를 정확히 정할 수 없다.",
      "rubric": {
        "required": [
          "두 경로와 화살표 약속",
          "정확한 개체수 예측의 한계"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "먹이 관계의 연결은 그릴 수 있지만 개체수 변화의 모든 조건을 보여 주는 자료는 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 21,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "하천 생태계 보전 토의에서 근거에 맞는 제안은 무엇인가요?",
    "givens": null,
    "choices": [
      "한 번 청소하면 모든 영향이 없어진다고 쓴다.",
      "조사한 쓰레기 문제에 맞춰 실천을 계획한다.",
      "사진 한 장으로 모든 생물 수가 늘었다고 한다.",
      "계획서가 있으면 하천이 회복됐다고 확정한다.",
      "의견을 안 받았어도 모두 동의했다고 적는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "인간 활동의 영향을 조사한 자료와 실천을 연결해요. 계획·실제 행동·환경의 변화를 같은 증거로 세지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 22,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "보전 활동의 실제 기록을 남기는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "실천한 날짜와 한 일을 구체적으로 적는다.",
      "파일을 저장하면 주민에게 전달됐다고 쓴다.",
      "못한 일과 받은 의견이 없는 상태도 남긴다.",
      "준비만 했어도 활동 전체 완료로 표시한다.",
      "계획한 횟수를 실제 참여 횟수로 바꿔 쓴다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "실제 활동과 계획·미실행·자료 저장·전달을 구별해요. 기록 수가 실제 생태계 회복을 자동으로 증명하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 23,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "보전 활동 가상 기록에 “월요일 계획, 화요일 실제 실천, 수요일 못함, 목요일 실제 실천”이라고 적었습니다. 실제 실천한 날 수만 쓰세요.",
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
    "explanation": "화요일과 목요일 두 날에 실제로 실천했어요. 계획한 날과 못한 날은 더하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 24,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "모둠은 보전 안내문을 저장했지만 아직 누구에게도 전달하지 않았습니다. 공유 기록을 정직하게 남기고 다음에 확인할 내용을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "파일 저장 상태로 기록하고 실제 전달은 아직 하지 않았다고 남긴다. 전달할 상대·방법을 계획하고 실제 전달 날짜와 받은 의견·수정 내용을 이후 별도로 확인한다.",
      "rubric": {
        "required": [
          "저장과 실제 전달 구별",
          "의견·수정과 다음 행동 확인"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "컴퓨터에 파일이 있다고 실제 소통이 이루어진 것은 아니에요. 전달·의견 수신을 실제 사실로 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 25,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "공기의 무게를 비교한 가상 실험에서 믿을 수 있는 비교 조건은 무엇인가요?",
    "givens": null,
    "choices": [
      "공기를 넣은 뒤 겉에 물을 묻혀 비교한다.",
      "공기를 뺀 뒤 마개도 빼고 전체를 비교한다.",
      "같은 단단한 용기와 같은 마개를 함께 잰다.",
      "부피가 커진 풍선과 작은 풍선을 바로 비교한다.",
      "다른 저울로 한 번씩 재고 차이를 확정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "공기 이외에 용기·부품·겉 상태·저울 조건이 바뀌면 그 차이를 공기 무게만으로 해석하기 어려워요. 바깥 부피가 같은 단단한 용기를 비교해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 26,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "같은 단단한 용기에 공기를 더 넣은 가상 결과를 해석하는 방법 두 가지를 고르세요.",
    "givens": {
      "가상 관찰 자료": {
        "머리": [
          "조건",
          "전체 무게"
        ],
        "행": [
          [
            "공기를 더 넣기 전",
            "162.4g"
          ],
          [
            "공기를 더 넣은 뒤",
            "164.0g"
          ]
        ],
        "caption": "가상 관찰 자료"
      }
    },
    "choices": [
      "용기 겉의 물 무게는 무조건 공기라고 센다.",
      "한 번의 눈금으로 모든 기체 무게를 정한다.",
      "마개를 포함한 같은 전체 구성으로 비교한다.",
      "저울에서 차이가 안 보이면 공기는 무게가 없다.",
      "공기 출입 외에 달라진 조건이 없는지 본다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "같은 용기·부품·바깥 부피·마른 표면과 저울 상태를 확인해 공기 추가와 무게 차이를 연결해요. 작은 차이는 저울 한계도 살펴요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 27,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "같은 단단한 용기와 같은 마개를 잰 가상 결과가 공기 추가 전 162.4g, 추가 후 164.0g입니다. 늘어난 값만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "1.6",
      "accepted": [
        "1.6"
      ]
    },
    "explanation": "164.0에서162.4를 빼면1.6이에요. 이 차이를 공기에 연결하려면 다른 조건이 같고 저울로 구분 가능한지도 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 28,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "공기를 더 넣은 용기를 재려는데 마개를 다른 것으로 바꾸고 겉의 물도 닦지 않았습니다. 비교 실험을 어떻게 바로잡고 어떤 한계를 남길지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 단단한 용기와 같은 마개·부품을 사용하고 겉을 말려 같은 저울로 다시 비교한다. 공기 출입 외 조건과 반복 결과를 확인하며 작은 차이는 저울 눈금·흔들림 때문에 구분되지 않을 수 있다고 남긴다.",
      "rubric": {
        "required": [
          "용기·마개·표면·저울 통제",
          "반복 확인과 저울 한계"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "변한 조건을 섞으면 무게 차이의 까닭을 하나로 정할 수 없어요. 측정의 한계도 함께 기록해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 29,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "막힌 주사기의 같은 양의 공기를 천천히 누를 때 부피 변화를 비교하려 합니다. 적절한 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "눈금을 읽지 않고 누른 횟수로 부피를 정한다.",
      "기체가 빠져도 같은 양을 유지했다고 기록한다.",
      "마개를 열어 공기를 빼며 누르는 효과라고 한다.",
      "동시에 공기를 더 넣고 온도도 바꾸어 비교한다.",
      "온도와 공기 누출을 살피며 누르는 정도만 바꾼다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "누르는 정도의 영향을 보려면 공기 양·온도 등 다른 조건을 살펴야 해요. 한꺼번에 여러 조건을 바꾸면 해석하기 어려워요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 30,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "같은 양의 공기에서 온도와 부피를 살피는 가상 실험의 조건 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "공기가 드나들지 않도록 상태를 확인한다.",
      "관찰 없이 모든 부피가 같다고 미리 정한다.",
      "따뜻한 조건에서는 누르는 정도도 더 크게 한다.",
      "누르는 조건을 비슷하게 유지해 비교한다.",
      "온도마다 공기 양도 바꾸어 결과를 섞는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "온도를 비교할 때는 같은 기체 양과 비슷한 누르는 조건이 중요해요. 실제 관찰한 부피와 예측을 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 31,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "같은 양의 공기를 같은 온도에서 누르는 정도만 늘리자 가상 부피가 30mL에서 22mL가 되었습니다. 부피는 “늘었다/줄었다” 중 어느 쪽인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "줄었다",
      "accepted": [
        "줄었다",
        "줄어들었다",
        "감소했다",
        "감소"
      ]
    },
    "explanation": "30mL보다22mL가 작으므로 부피가 줄었어요. 공기가 새지 않은 같은 양의 비교라는 조건을 함께 읽어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 32,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "친구가 공기의 온도를 높이면서 동시에 피스톤을 더 세게 눌렀습니다. 부피 변화의 원인을 온도 하나로 정할 수 없는 까닭과 수정할 실험을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "온도와 누르는 정도가 함께 바뀌어 어느 조건의 영향인지 나누기 어렵다. 같은 공기 양에서 누르는 조건을 비슷하게 유지하며 온도만 바꾸거나, 온도를 유지하며 누르는 정도만 바꾸어 비교한다.",
      "rubric": {
        "required": [
          "두 조건 변화로 원인 분리 불가",
          "같은 양에서 한 조건만 바꾸는 비교"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "관찰 결과가 있어도 비교 조건이 섞이면 한 원인으로 확정할 수 없어요. 자세한 발생 원리와 계산식을 필수로 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 33,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "공기와 생활 속 기체를 조사한 설명 중 옳은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "공기는 산소 한 종류로만 이루어진다.",
      "용기에 든 기체는 이름 없이도 모두 구분된다.",
      "공기는 여러 기체가 섞여 있다.",
      "공기는 순수 산소와 모든 성질이 같다.",
      "기체는 모두 같은 성질과 쓰임을 가진다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "공기를 순수 산소 한 종류와 같다고 하지 않아요. 기체 이름·성질·이용 조건을 자료로 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 34,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "생활 속 기체 이용을 조사할 때 알맞은 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "자료의 기체 이름과 이용 목적을 함께 적는다.",
      "한 가지 이용 예로 모든 기체의 쓰임을 정한다.",
      "성질 설명의 출처와 사용 조건을 확인한다.",
      "성질이 궁금하면 모든 기체에 불꽃을 댄다.",
      "기체 이름을 알아내려고 직접 들이마신다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "신뢰할 자료로 종류·성질·이용을 연결해요. 직접 흡입하거나 불꽃·약품 발생 실험을 할 필요가 없어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 35,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "기체 조사 자료의 기호 중 종류와 이용 목적을 함께 적은 기록을 고르세요.",
    "givens": {
      "연습 자료": "ㄱ 기체를 보았다. / ㄴ 교사 제공 자료: 헬륨—풍선에 이용. / ㄷ 이름과 출처는 모르지만 모두 같은 용도다."
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
    "explanation": "ㄴ은 기체 이름과 이용 예가 함께 있어요. 이 자료를 읽은 것이 직접 사용·실험했다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 36,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "친구가 “기체는 모두 똑같아서 조사할 필요가 없다.”라고 했습니다. 자료 조사로 비교할 항목과, 직접 실험 없이도 확인할 수 있는 기록 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "서로 다른 기체의 이름·성질·생활 이용 목적과 조건을 출처가 있는 자료로 비교한다. 제공 자료나 조사 출처를 적고 직접 사용하지 않은 것은 자료 조사라고 구별한다.",
      "rubric": {
        "required": [
          "기체 종류·성질·이용의 비교",
          "출처와 자료 조사/직접 사용 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "종류가 다른 기체의 성질·이용은 자료로 비교할 수 있어요. 위험한 시험을 새로 시키지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 37,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "공기를 이용하는 장치를 설계한 뒤 실제 제작 상태를 적는 방법 중 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "설계도와 실제 만든 부분을 나누어 기록한다.",
      "설계도가 있으면 장치가 작동했다고 적는다.",
      "사진만 찍으면 작동 원인이 증명됐다고 한다.",
      "시도하지 않은 수정을 재시험 완료로 적는다.",
      "준비한 재료 수를 성공 횟수로 바꾸어 쓴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "설계·제작·작동 시험은 각각 다른 증거예요. 실제로 한 행동과 아직 하지 않은 행동을 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 38,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "공기 장치의 작동을 개선할 때 타당한 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "작동이 안 되면 결과를 성공으로 바꿔 쓴다.",
      "재시험 계획을 세우면 재시험 완료로 표시한다.",
      "모든 부품을 동시에 바꾸고 원인을 확정한다.",
      "공기가 새는 곳과 연결 상태를 확인한다.",
      "수정 전후를 비슷한 조건에서 다시 시험한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "공기의 성질을 이용하는 구조와 작동을 확인하고 같은 비교 조건에서 수정 효과를 살펴요. 실패·미실행도 기록해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 39,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "장치 기록이 “설계 완료, 일부 제작, 작동 시험 아직 안 함”입니다. 실제 작동 시험 횟수는 몇 회인가요? 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "0",
      "accepted": [
        "0"
      ]
    },
    "explanation": "시험을 아직 하지 않았으므로 실제 횟수는0이에요. 설계와 일부 제작은 시험 횟수에 더하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 40,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "공기를 내보내 움직이게 하는 장치를 계획했습니다. 어떤 성질·구조를 이용할지와 실제 제작·작동·수정 후 시험을 구별해 남길 기록을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "공기가 차지하는 공간과 밖으로 나오는 흐름을 이용할 구조·연결·목적을 설계한다. 실제 만든 부분과 미완성 부분, 작동 조건·관찰 결과를 적고 수정 내용과 재시험 여부·결과를 따로 남긴다.",
      "rubric": {
        "required": [
          "기체 성질과 목적·구조 연결",
          "제작/작동/수정/재시험 실제 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "설계의 예상 작동과 실제 결과를 나누어요. 장치가 반드시 성공한다고 미리 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 41,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "어느 지역의 같은 기간 평균 기온과 평년값을 비교하려 합니다. 비교에 적절한 자료는 무엇인가요?",
    "givens": null,
    "choices": [
      "같은 지역·같은 기간의 출처가 있는 값",
      "어제 느낀 더위만 적은 소감",
      "강수량과 기온을 단위 없이 합친 수",
      "다른 지역의 하루 최고기온 하나",
      "기간을 모르는 사진 속 옷차림"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "기후변화 사례는 지역·기간·단위·평년 기준을 확인해 비교해요. 하루의 체감만으로 장기 변화를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 42,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "기후변화와 인간 활동을 토의하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "자료의 지역·기간과 출처를 확인한다.",
      "하루 추우면 장기 변화가 없다고 확정한다.",
      "날짜가 다른 값은 단위를 지워 합쳐 쓴다.",
      "인간 활동과 관련된 근거를 함께 살핀다.",
      "한 학생의 행동만으로 모든 변화를 설명한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "여러 자료와 인간 활동의 관련 근거를 비교해요. 한 사람의 행동이나 하루 날씨로 전체 원인을 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 43,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "같은 지역·같은 기간의 가상 평균 기온은 평년 12.0℃, 비교 기간 13.5℃입니다. 평년보다 높은 값의 차이만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "1.5",
      "accepted": [
        "1.5"
      ]
    },
    "explanation": "13.5에서12.0을 빼면1.5예요. 가상 비교값이며 학생 실측이나 현재 실제 지역 통계가 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 44,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "하루가 쌀쌀했다는 이유로 기후변화가 없다고 결론 냈습니다. 어떤 자료를 더 살펴보고 인간 활동과의 관련을 어떻게 토의할지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 지역·계절이나 기간의 장기간 기온·강수 자료와 평년 기준·출처를 확인한다. 하루 날씨와 기후 사례를 구별하고 인간 활동과 관련된 여러 근거를 함께 비교해 토의한다.",
      "rubric": {
        "required": [
          "하루와 장기 자료 구별",
          "자료 조건·출처와 인간 활동 근거 토의"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "하루 관찰이 장기 자료 전체를 대신하지 않아요. 자세한 발생 기작을 암기시키는 대신 비교 근거를 설명하게 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 45,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "육지와 집을 놓은 피해 모형에서 물높이만 바꿔 젖는 범위를 비교합니다. 유지할 조건으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "물높이와 집 크기와 통 모양 전부",
      "육지 모양·집 위치·젖음 판정 기준",
      "매번 집 위치와 육지 기울기",
      "젖었다고 표시하는 기준의 임의 변경",
      "결과가 나올 때까지 바꾸는 사진 각도"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "물높이의 영향을 살피려면 지형·집·통·판정 기준 등 다른 조건을 유지해요. 비교 중 바뀐 조건도 기록해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 46,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "기후변화 피해 모형 결과를 해석한 설명 중 타당한 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "모형의 모든 관찰을 실제 주민 측정값으로 바꾼다.",
      "모형 물높이로 실제 침수 연도를 바로 계산한다.",
      "실제 도시의 모든 피해를 증명한 것은 아니라고 한다.",
      "모형에서 같은 조건으로 비교한 범위를 밝힌다.",
      "모형 집이 젖으면 모든 지역 집도 같은 날 젖는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "모형은 특정 조건의 영향을 살피는 도구예요. 실제 지역의 지형·비·시설 등 모든 조건과 미래 연도를 증명하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 47,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 피해 모형 기록이 “집 위치 같음, 지형 같음, 물높이 두 단계, 두 번째에 지형 붕괴”입니다. 조건이 달라져 비교를 주의할 항목의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 같은 집 위치 / ㄴ 같은 통 / ㄷ 두 번째의 지형 붕괴"
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
    "explanation": "지형이 무너지면 물높이 외 조건도 달라져요. 결과를 그대로 같은 조건의 비교라고 확정하지 않고 바뀐 조건을 남겨요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 48,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "모형을 다시 시험했는데 첫 시험의 물기가 남아 집이 젖어 있었습니다. 반복 비교를 바로잡는 방법과 실제 지역 피해에 적용할 때의 한계를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "남은 물기를 없애고 처음 지형·집 위치·바닥 기준과 젖음 판정을 복구한 뒤 같은 조건에서 반복한다. 복구하지 못한 점은 따로 적고 이 모형만으로 실제 도시의 침수 깊이·연도나 모든 원인을 정하지 않는다.",
      "rubric": {
        "required": [
          "처음 상태·기준 복구와 반복",
          "미복구 조건·실제 지역 적용 한계"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "반복 횟수만 늘려도 시작 조건이 다르면 같은 비교가 아니에요. 모형과 실제 현상을 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 49,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "기후변화 대응 실천을 기록하는 설명 중 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "실천 횟수만으로 지구 기온 감소를 확정한다.",
      "계획한 일은 모두 실제 완료로 표시한다.",
      "못한 날은 결과를 좋게 보이도록 지워 버린다.",
      "안내문 저장은 의견을 받은 것으로 센다.",
      "여건에 맞는 행동과 실제 한 날짜를 남긴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "계획과 실제 실천·못한 사유를 나누어요. 행동 기록은 실제 배출량·지구 기온 감소 측정과 다른 증거예요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 50,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "대응 방법 조사와 실천 계획에 넣을 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "학교·지역의 공동 도움과 참여 어려움",
      "실제 결과 없이 기온 감소량을 만들어 낸 수치",
      "개인의 노력만으로 모든 대응을 끝냈다는 결론",
      "자료 출처와 우리 여건에 맞는 실행 방법",
      "건강·안전과 상관없이 무조건 지킬 규칙"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "실행 가능한 대응과 공동 도움·참여 조건을 함께 살펴요. 건강·안전을 무시하거나 측정하지 않은 효과를 수치로 만들지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 51,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 실천표에서 월·수요일은 실제 실천, 화요일은 못함, 목요일은 계획만 했습니다. 실제 실천한 날 수를 숫자로 쓰세요.",
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
    "explanation": "월요일과 수요일 두 날이에요. 계획과 미실행은 실제 실천 횟수에서 제외해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f1-52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 52,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "대응 활동을 소개했지만 아직 의견을 받지 못했습니다. 공유 상태와 다음 행동, 실제 효과를 과장하지 않는 기록 방법을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "실제로 전달한 상대·날짜·방법과 아직 의견을 받지 못한 상태를 적는다. 의견 요청과 수정·재공유를 계획하고 실제로 한 뒤 따로 기록한다. 실천 횟수를 측정하지 않은 배출량·지구 기온 감소로 바꾸지 않는다.",
      "rubric": {
        "required": [
          "실제 전달과 의견 미수신 구별",
          "수정·재공유 실제 확인",
          "행동 기록과 효과 실측 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "공유·의견·수정은 각각 실제로 확인해요. 실천한 사실과 환경 효과를 측정한 사실은 같지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 1,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "달 모양을 비교한 그림 중 한 장은 관측 프로그램 화면입니다. 노트에 쓸 설명으로 타당한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "그림이 있으니 직접 본 날짜로 바꾸어 적는다.",
      "프로그램 자료임을 실제 관찰과 나누어 적는다.",
      "프로그램의 모든 표면을 손으로 만졌다고 한다.",
      "자료 출처를 지우면 관찰 증거가 더 강해진다.",
      "직접 못 본 날도 화면과 같았다고 확정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "프로그램 화면을 보는 것도 학습 자료지만 직접 밤하늘을 본 활동과 구별해요. 설정·출처와 미관찰을 남겨요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 2,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "달의 여러 날 변화와 표면을 살피는 방법 중 맞는 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "보인 모양과 실제 관찰 날짜를 함께 적는다.",
      "사진 크기로 실제 표면 자국 크기를 확정한다.",
      "표면 사진에서 확인한 무늬를 출처와 적는다.",
      "모양 차이가 나면 달의 재료가 바뀌었다고 한다.",
      "흐려 못 본 날은 달이 없어졌다고 기록한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "보이는 특징과 자료 조건을 근거로 기록해요. 표면의 실제 크기·생성 시각이나 모양 변화 원인을 임의로 결론 내리지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 3,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 달 기록 여섯 칸 중 직접 본 칸은 세 칸, 교사 사진은 두 칸, 미관찰은 한 칸입니다. 직접 관찰한 칸 수만 쓰세요.",
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
    "explanation": "직접 본 세 칸만 세어요. 제공 자료를 본 것과 미관찰을 실제 달 관찰 횟수에 더하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 4,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "구름 때문에 못 본 날의 달을 친구 그림과 같게 채웠습니다. 원래 기록을 어떻게 고치고 이후 관찰·자료 활용을 어떻게 나눌지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "그날은 구름 때문에 미관찰로 고친다. 친구 그림을 참고했다면 그 사실과 출처를 따로 적고, 이후 직접 본 날짜·시각·장소·방향과 모양을 구별해 남긴다.",
      "rubric": {
        "required": [
          "미관찰 복원·친구 자료 표시",
          "후속 실제 관찰 조건 기록"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "친구의 관찰은 내 직접 관찰과 같은 증거가 아니에요. 참고는 할 수 있어도 기록의 성격을 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 5,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "태양계 분류표에서 지구와 같은 “행성” 칸에 넣을 이름은 무엇인가요?",
    "givens": null,
    "choices": [
      "태양",
      "카시오페이아자리",
      "목성",
      "달",
      "북극성"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "목성과 지구는 태양계의 행성이에요. 태양·북극성은 별이고 달과 별자리는 행성과 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 6,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "태양계 구성원을 설명한 내용 중 맞는 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "태양을 행성과 구별해 별로 소개한다.",
      "행성 목록에 지구도 포함해 조사한다.",
      "달은 지구와 같으므로 행성 수에 더한다.",
      "크기가 같은 카드면 천체 크기도 모두 같다.",
      "밝은 행성은 스스로 빛을 내는 별로 바뀐다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "태양은 별, 지구는 행성이에요. 그림의 크기나 보이는 밝기가 천체 분류를 바꾸지는 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 7,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "자료에 행성 여덟 개와 태양 한 개를 소개했습니다. 태양을 제외한 행성 카드 수만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "8",
      "accepted": [
        "8"
      ]
    },
    "explanation": "태양은 행성 수에 더하지 않아요. 소개 카드 전체 수와 행성 카드 수를 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 8,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "행성 사이 간격을 같은 길이로 붙인 전시를 보고 실제 거리도 같다고 했습니다. 전시의 약속과 추가로 확인할 자료를 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 간격은 전시하기 위한 배치일 수 있으므로 실제 거리가 같다는 근거가 아니다. 간격의 축척·설명과 조사 자료 출처를 확인하고 실제 비율을 나타내지 않았다면 한계로 적는다.",
      "rubric": {
        "required": [
          "배치 간격과 실제 거리 구별",
          "축척·자료 출처·표현 한계 확인"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모형의 배치를 실제 물리량으로 자동 변환하지 않아요. 이 평가에서 행성의 실제 거리 수치를 외우도록 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 9,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "해가 진 뒤 밝은 점을 보고 모두 별이라고 했습니다. 먼저 확인할 기준은 무엇인가요?",
    "givens": null,
    "choices": [
      "눈에 작게 보이면 모두 별로 정한다.",
      "밤에 보였으니 모두 별이라고 정한다.",
      "하늘에서 보이면 행성 분류를 없앤다.",
      "스스로 빛을 내는 천체인지 확인한다.",
      "사진에서 밝으면 달도 별로 정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "밝고 작게 보인다는 사실만으로 별·행성·달을 모두 같은 종류로 분류할 수 없어요. 별의 정의를 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 10,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "북극성 주변의 관찰 그림을 비교할 때 확인할 조건 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "건물에 가려 확인하지 못한 부분",
      "그림에서 모르는 이름을 지어낸 목록",
      "북쪽을 정한 방법과 관찰한 시각",
      "밝기만으로 모든 별자리를 정답으로 단정한 설명",
      "다른 날 자료를 오늘 직접 본 것으로 바꾼 표시"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "관찰 조건과 가림·미확인을 함께 봐야 비교 범위가 분명해요. 프로그램·다른 날 자료와 실제 관찰도 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 11,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "관찰 자료에서 북극성 주변을 살필 방향의 기호를 고르세요.",
    "givens": {
      "연습 자료": "ㄱ 남쪽 / ㄴ 동쪽 / ㄷ 서쪽 / ㄹ 북쪽"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "explanation": "북극성 주변 관찰은 북쪽 방향을 기준으로 해요. 실제 장소에서 방향을 확인하고 자료를 맞추어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 12,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "친구의 야외 그림에는 일부 별이 없지만 프로그램에는 있습니다. 곧바로 별이 사라졌다고 할 수 없는 까닭과 비교 기록을 보완할 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "건물·구름이나 밝기 때문에 보지 못했을 수 있고 프로그램의 시각·장소 설정도 다를 수 있다. 관찰 시각·방향·가림을 적고 프로그램 조건과 출처를 확인해 실제 본 부분과 미확인을 나누어 비교한다.",
      "rubric": {
        "required": [
          "안 보임과 존재 소멸 구별",
          "관찰·프로그램 조건과 미확인 기록"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "시야에 안 보인다는 사실과 천체가 없어졌다는 결론은 달라요. 같은 비교 조건을 먼저 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 13,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "학교 화단 조사에서 비생물 요소로 분류할 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "풀",
      "개미",
      "지렁이",
      "흙",
      "민들레"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "흙은 비생물 요소예요. 제시한 식물과 동물은 모두 생물 요소로 분류해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 14,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "가상 숲 조사표를 보완하는 설명 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "조사하지 않은 흙은 숲에 없다고 확정한다.",
      "나무와 새 외에 물·흙·빛도 살핀다.",
      "멀리서 안 움직인 나무는 비생물로 바꾼다.",
      "확인한 장소·시점과 미확인 요소를 나눈다.",
      "작은 곤충은 크기 때문에 생물에서 제외한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "생물·비생물 요소를 함께 살피고 조사한 범위를 명시해요. 움직임·크기·누락으로 생물 여부나 존재를 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 15,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 화단 조사에서 “장미·개미·빛·물·흙”을 확인했습니다. 비생물 요소의 수를 숫자로 쓰세요.",
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
    "explanation": "빛·물·흙 세 개가 비생물 요소예요. 장미와 개미는 생물 요소예요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 16,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "사진에는 물·바위·풀만 보입니다. 친구가 이곳에는 동물이 전혀 없다고 했습니다. 자료가 뒷받침하는 범위와 추가 조사 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사진에서 물·바위·풀은 확인했지만 동물이 전혀 없다는 것은 확인하지 못했다. 장소·시점·관찰 범위를 적고 다른 시점이나 범위를 추가 조사하며 생물·비생물 요소와 미확인을 함께 기록한다.",
      "rubric": {
        "required": [
          "사진 범위와 존재 단정 구별",
          "조건 있는 추가 조사·분류 기록"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "특정 사진에 안 나왔다는 사실만으로 생태계 전체의 부재를 증명할 수 없어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 17,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "가상 관계표에서 작은 물고기가 물벼룩을 먹습니다. “먹이→먹는 생물” 약속에 맞는 연결은 무엇인가요?",
    "givens": null,
    "choices": [
      "작은 물고기→흙",
      "햇빛→작은 물고기",
      "작은 물고기→물벼룩",
      "물벼룩→작은 물고기",
      "물벼룩→물"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "먹이인 물벼룩에서 먹는 작은 물고기로 그어요. 다른 화살표 방향 약속을 섞지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 18,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "가상 연못 먹이 관계표에서 확인할 수 있는 설명 두 가지를 고르세요.",
    "givens": {
      "가상 관찰 자료": {
        "머리": [
          "먹는 생물",
          "먹이"
        ],
        "행": [
          [
            "물벼룩",
            "식물성 플랑크톤"
          ],
          [
            "작은 물고기",
            "물벼룩"
          ],
          [
            "큰 물고기",
            "물벼룩·작은 물고기"
          ]
        ],
        "caption": "가상 관찰 자료"
      }
    },
    "choices": [
      "먹이가 둘이면 환경 변화에도 생존을 보장한다.",
      "작은 물고기가 식물성 플랑크톤을 먹는다고 나와 있다.",
      "큰 물고기는 두 먹이 경로에 연결된다.",
      "큰 물고기 한 마리의 수명까지 이 표로 안다.",
      "물벼룩은 작은 물고기와 큰 물고기에 먹힌다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "표에 적힌 먹이 관계만 연결해요. 여러 경로가 있더라도 수명·정확한 개체수·생존 보장을 알려 주지는 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 19,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 먹이 관계 “벼→메뚜기→참새, 벼→들쥐→뱀, 참새→뱀”에서 참새와 들쥐를 먹는 생물은 무엇인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "뱀",
      "accepted": [
        "뱀"
      ]
    },
    "explanation": "참새→뱀과 들쥐→뱀을 함께 읽어요. 화살표는 먹이에서 먹는 생물로 향하는 약속이에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 20,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "제시한 가상 연못 자료로 두 경로를 먹이그물로 연결하고, 물벼룩이 줄어든 뒤 큰 물고기 수를 바로 정할 수 없는 까닭을 쓰세요.",
    "givens": {
      "연습 자료": "물벼룩은 식물성 플랑크톤, 작은 물고기는 물벼룩, 큰 물고기는 물벼룩과 작은 물고기를 먹는다. 화살표는 먹이→먹는 생물이다."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "식물성 플랑크톤→물벼룩→큰 물고기와 식물성 플랑크톤→물벼룩→작은 물고기→큰 물고기를 함께 연결한다. 다른 먹이와 환경·이동 자료가 없으므로 큰 물고기의 정확한 수는 확정할 수 없다.",
      "rubric": {
        "required": [
          "두 경로와 화살표 약속",
          "다른 조건과 개체수 미확정"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "먹이 감소의 영향 가능성과 정확한 생물 수의 예측은 다른 판단이에요. 대체 경로는 생존 보장이 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 21,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "숲 보전 안내문에 쓸 설명 중 조사 근거에 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "의견을 안 물었어도 모두 찬성했다고 적는다.",
      "자료를 저장하면 전달과 실천도 끝났다고 한다.",
      "실천 계획만으로 모든 훼손이 사라졌다고 한다.",
      "확인한 훼손 사례와 실천 방법을 연결한다.",
      "한 장의 사진으로 모든 나무의 회복을 확정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "인간 활동의 영향과 대응을 근거로 연결해요. 계획·전달·실천·환경 변화가 각각 확인됐는지 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 22,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "모둠의 생태계 보전 토의 내용을 남기는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "자료의 출처와 서로 다른 의견을 적는다.",
      "토의 계획만 있어도 실제 토의 완료로 센다.",
      "반대 의견은 처음부터 없던 것으로 지운다.",
      "실제로 합의한 내용과 미합의 내용을 나눈다.",
      "발표자가 말하면 모두의 동의로 기록한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "토의했다는 사실과 실제 의견·합의는 기록으로 확인해요. 의견 차이와 미실행을 없애지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 23,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "보전 활동을 소개한 파일은 저장했지만 전달하지 않았습니다. 실제 전달 횟수를 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "0",
      "accepted": [
        "0"
      ]
    },
    "explanation": "파일 저장은 전달 횟수가 아니에요. 실제로 보내거나 설명한 일이 없으므로0회예요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 24,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "생태계 보전 계획은 세웠지만 비가 와서 실행하지 못했습니다. 미실행을 남기는 방법과 이후 실천·공유를 어떻게 확인할지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "날짜와 비로 실행하지 못한 사실을 적는다. 여건에 맞게 계획을 조정하고 실제 한 날짜·행동을 따로 남긴다. 공유한 상대·방법과 받은 의견·수정은 실제 확인 후 기록한다.",
      "rubric": {
        "required": [
          "계획과 미실행·실제 행동 구별",
          "실제 공유·의견·수정 확인"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "못한 날도 기록의 일부예요. 계획 수를 실제 실천 횟수로 바꾸거나 공유를 자동 완료하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 25,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "같은 단단한 용기에 공기를 더 넣은 뒤 전체 무게가 늘었습니다. 비교를 바르게 해석하는 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "마개·표면·저울 등 다른 조건이 같았는지 살핀다.",
      "마개를 빼서 생긴 차이도 공기 무게로 합친다.",
      "다른 저울의 값 차이를 바로 공기 무게로 정한다.",
      "겉의 물 무게까지 공기 무게로 합쳐 쓴다.",
      "크기가 다른 용기의 차이를 공기 무게로 바로 쓴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "공기 외 조건이 같아야 차이를 공기 추가와 연결할 수 있어요. 바깥 부피가 같은 용기 전체의 비교와 저울 한계도 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 26,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "가상 공기 무게 비교 기록에서 주의할 점 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "부품을 바꾼 비교는 공기만의 효과로 정하지 않는다.",
      "축축한 용기의 차이는 전부 공기 무게로 센다.",
      "차이가 눈금보다 작으면 측정 한계를 남긴다.",
      "반복값이 달라도 가장 큰 값만 공식값으로 쓴다.",
      "차이가 안 보이면 공기는 무게가 없다고 정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "부품·표면·저울 조건이 바뀌면 차이의 해석을 제한해야 해요. 구분되지 않는 차이를 없는 무게라고 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 27,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "같은 용기 전체의 가상 무게가 공기 추가 전 205.5g, 추가 후 207.8g입니다. 늘어난 값만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2.3",
      "accepted": [
        "2.3"
      ]
    },
    "explanation": "207.8에서205.5를 빼면2.3이에요. 같은 구성·마른 표면·측정 가능한 저울 등 비교 조건을 함께 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 28,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-01",
      "topic": "같은 용기의 기체 무게",
      "concept": "같은 용기의 기체 무게",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "친구가 같은 용기를 재었는데 무게 차이가 저울 눈금으로 구분되지 않았습니다. 공기는 무게가 없다고 단정할 수 없는 까닭과 보완할 기록을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "차이가 작으면 저울의 눈금·흔들림 때문에 구분되지 않을 수 있다. 같은 부품·표면·공기 출입 조건을 확인하고 반복 결과와 저울 한계를 적어 무게가 없다는 결론과 구별한다.",
      "rubric": {
        "required": [
          "측정 한계와 무게 부재 구별",
          "조건·반복 결과 기록"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "기기가 구분하지 못한 것과 물리적 성질이 없는 것은 달라요. 측정하지 못한 값을 지어내지도 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 29,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "같은 양의 공기를 비슷한 누르는 조건에서 따뜻하게 했더니 가상 부피가 커졌습니다. 자료에 맞는 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "공기 양도 부피와 같은 비율로 반드시 늘어났다.",
      "조건을 지킨 비교에서 온도에 따라 부피가 달라졌다.",
      "온도를 바꿨으니 누르는 조건은 유지할 필요 없다.",
      "따뜻하면 새 공기가 반드시 만들어져 양이 늘어난다.",
      "이 한 번으로 모든 기체의 모든 수치를 확정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "같은 기체 양과 비슷한 누르는 조건에서 온도에 따른 부피 변화를 관찰한 자료예요. 기체가 새로 생성됐다는 근거는 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 30,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "누르는 정도에 따른 부피를 비교하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "공기 양과 온도를 비슷하게 유지한다.",
      "눈금을 안 읽고 예상값을 관찰값으로 쓴다.",
      "누출 여부와 주사기 눈금을 함께 살핀다.",
      "누르는 힘과 온도와 기체 양을 모두 바꾼다.",
      "마개를 열어 공기를 빼며 같은 양이라 한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "한 조건을 바꾸고 다른 조건을 유지해야 비교가 분명해요. 누출·읽기 오류와 예상값을 실제 관찰과 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 31,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "같은 양의 공기를 비슷한 누르는 조건에서 따뜻하게 하자 가상 부피가 24mL에서 28mL가 되었습니다. 부피는 “늘었다/줄었다” 중 어느 쪽인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "늘었다",
      "accepted": [
        "늘었다",
        "늘어났다",
        "증가했다",
        "증가"
      ]
    },
    "explanation": "28mL는24mL보다 커서 부피가 늘었어요. 공기 양과 누르는 조건을 살펴 온도 비교로 해석해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 32,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-02",
      "topic": "온도·누르는 정도와 기체 부피",
      "concept": "온도·누르는 정도와 기체 부피",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "공기 부피 비교 중 연결 틈으로 공기가 빠져나갔습니다. 이 결과를 같은 양의 공기 비교로 쓰기 어려운 까닭과 다시 관찰할 조건을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "공기가 빠져나가면 양이 바뀌어 온도나 누르는 정도만의 효과로 정하기 어렵다. 누출을 확인하고 같은 공기 양에서 온도 또는 누르는 정도 중 하나만 바꾸며 눈금을 관찰·반복 기록한다.",
      "rubric": {
        "required": [
          "누출로 같은 양 조건 불충족",
          "한 조건 변화·관찰 반복"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "눈금 차이가 있어도 기체 양이 달라진 자료는 같은 조건의 비교와 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 33,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "생활 기체 조사에서 자료의 제목만 보고 성질을 단정하지 않으려면 무엇을 해야 하나요?",
    "givens": null,
    "choices": [
      "기체가 안 보이면 모두 같은 물질로 정한다.",
      "본문의 이름·성질·이용 조건을 확인한다.",
      "친구가 쓴 이름을 출처 없이 공식값으로 옮긴다.",
      "풍선 사진 하나로 안의 기체를 확정한다.",
      "냄새를 직접 맡아 모든 이름을 정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "사진이나 제목만으로 안의 기체 종류를 모두 알 수 없어요. 자료 본문과 출처·조건을 확인하고 미확인은 남겨요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 34,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "기체 조사 결과를 소개하는 내용 중 타당한 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "한 기체의 성질을 모든 기체의 성질로 넓힌다.",
      "헬륨 이용 자료면 모든 풍선은 헬륨이라고 한다.",
      "산소는 공기 전체와 같은 뜻이라고 바꿔 쓴다.",
      "기체별 성질과 쓰임을 근거 자료로 연결한다.",
      "공기가 여러 기체의 혼합임을 구별한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "공기와 순수 기체, 특정 이용 사례와 모든 사례를 구별해요. 성질·이용을 자료의 범위 안에서 설명해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 35,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "생활 속 기체 이용 자료 “탄산음료에는 이산화 탄소가 이용된다.”에서 기체 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "이산화 탄소",
      "accepted": [
        "이산화 탄소",
        "이산화탄소"
      ]
    },
    "explanation": "제공 자료의 기체 이름은 이산화 탄소예요. 자료 확인이 직접 기체를 발생·흡입했다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 36,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-03",
      "topic": "기체 성질·생활 이용 조사",
      "concept": "기체 성질·생활 이용 조사",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "모둠이 풍선 사진만 보고 안의 기체를 모두 헬륨이라고 썼습니다. 조사 결론과 자료 확인 방법을 어떻게 고칠지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사진만으로 풍선 안의 기체 종류가 모두 확인된 것은 아니라고 고친다. 설명·출처에서 실제 기체 이름과 성질·이용 목적을 확인하고 알 수 없는 부분은 미확인으로 남긴다.",
      "rubric": {
        "required": [
          "사진과 기체 종류 확정 구별",
          "본문·출처·이용 조건 확인"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "겉모습이 비슷한 용기에 다른 기체가 들어갈 수 있어요. 기체를 직접 들이마시거나 불꽃으로 확인하도록 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 37,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "공기 장치 기록 중 실제 수정 후 재시험을 했다고 확인할 수 있는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "연결을 고치고 다음 주에 시험하겠다는 계획",
      "재료를 책상에 모아 둔 사진",
      "연결을 고친 뒤 다시 시험한 조건과 결과",
      "처음 실패한 결과를 지운 빈 기록",
      "작동이 안 된 연결 부분을 표시해 둔 설계도"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "재시험은 수정 뒤 실제로 다시 시험한 조건·행동·결과가 있어야 해요. 계획·재료 준비·설계 수정과 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 38,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "공기를 이용할 장치를 설계할 때 연결할 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "설계만으로 작동 성공을 보증하는 문장",
      "모든 실패를 기록에서 지우는 규칙",
      "실제 시험 없이 효과 수치를 만드는 표",
      "이용할 기체 성질과 장치의 목적",
      "공기 흐름·연결 구조와 확인할 작동"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "성질·목적·구조·확인할 결과가 이어져야 설계를 시험할 수 있어요. 예상과 실제 결과를 분리해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 39,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "장치를 처음 시험한 뒤 연결만 고치고 아직 다시 시험하지 않았습니다. 수정 후 실제 재시험 횟수는 몇 회인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "0",
      "accepted": [
        "0"
      ]
    },
    "explanation": "처음 시험은 있었지만 수정 후 다시 시험한 적은 없어요. 재시험 계획이나 수정 작업은 재시험 횟수가 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 40,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과15-04",
      "topic": "공기 장치 설계·실제 제작",
      "concept": "공기 장치 설계·실제 제작",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "공기 장치가 한 번은 움직이고 한 번은 움직이지 않았습니다. 성공 한 번만 남기지 않고 어떻게 비교·수정·재시험을 기록할지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 번의 실제 조건과 움직임을 모두 적고 연결·누출 등 달라진 점을 확인한다. 고칠 부분을 정해 수정하고 비슷한 조건에서 실제로 다시 시험한 결과와 아직 하지 못한 일을 나누어 기록한다.",
      "rubric": {
        "required": [
          "반복 성공/실패 조건·결과 보존",
          "수정과 실제 재시험 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "잘된 결과만 남기면 작동을 안정적으로 설명하기 어려워요. 모든 부품을 한꺼번에 바꾸고 한 원인으로 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 41,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "같은 지역·기간의 가상 평균 기온이 평년보다 높았습니다. 타당한 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "비교 조건과 차이를 적고 자료 범위를 밝힌다.",
      "이 자료 하나로 매일 기온이 같다고 단정한다.",
      "강수량 단위를 지우고 기온과 합쳐 기록한다.",
      "비교 기간을 빼야 장기 변화를 더 정확히 안다.",
      "이 값으로 한 학생이 원인임을 증명했다고 한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "같은 지역·기간·단위와 평년 기준을 적어 비교해요. 한 자료의 차이가 모든 원인·매일 날씨를 증명하지는 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 42,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "기후 사례를 정리한 자료에서 확인할 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "한 사람의 기분으로 바꾼 장기 평균값",
      "기온·강수 등 항목의 단위와 출처",
      "비교하지 않고 만든 현재 순위",
      "다른 지역·기간 숫자를 같은 조건으로 합친 값",
      "관측 지역과 비교한 기간·평년 기준"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "자료의 비교 조건을 확인해야 차이를 해석할 수 있어요. 가상값이나 과거 자료를 현재 최신 실제 순위로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 43,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "같은 지역·같은 달의 가상 강수량이 평년 80mm, 비교 해 65mm입니다. 평년보다 줄어든 양만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "15",
      "accepted": [
        "15"
      ]
    },
    "explanation": "80에서65를 빼면15예요. 강수량 비교 연습값이며 실제 학교 측정이나 현재 지역 통계가 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 44,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-01",
      "topic": "평년 사례·인간 활동 토의",
      "concept": "평년 사례·인간 활동 토의",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "토의에서 어떤 친구는 하루 체감만 말하고 다른 친구는 출처가 있는 여러 해 자료를 제시했습니다. 두 근거를 어떻게 구별하고 인간 활동과의 관련을 확인할지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "하루 체감은 그날 경험으로 적고 여러 해 자료의 지역·기간·단위·평년을 확인해 장기 비교 근거와 나눈다. 인간 활동과 관련된 자료를 추가로 확인하고 다른 의견과 근거를 함께 토의한다.",
      "rubric": {
        "required": [
          "체감과 장기 비교 자료 구별",
          "자료 조건과 인간 활동 관련 토의"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "개인 경험을 무시하는 것이 아니라 뒷받침할 수 있는 범위를 구별해요. 한 사람의 원인으로 모든 변화를 설명하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 45,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "피해 모형을 비교할 때 집 위치가 바뀌었습니다. 자료를 다루는 방법으로 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "젖은 집이 늘면 실제 도시 피해량으로 바로 쓴다.",
      "위치가 달라도 물높이만의 효과라고 확정한다.",
      "바뀐 조건은 삭제하고 성공 결과만 남긴다.",
      "이 모형이 실제 침수 연도를 정했다고 한다.",
      "변한 조건을 남기고 같은 조건의 재시험을 준비한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "집 위치도 결과에 영향을 줄 수 있어 물높이만의 효과로 정하기 어려워요. 바뀐 조건을 보존하고 처음 상태를 복구해 비교해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 46,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "기후변화의 생활·환경 영향을 설명하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "영향을 아직 못 봤으면 어느 곳에도 없다고 한다.",
      "사진 한 장으로 모든 지역의 미래를 확정한다.",
      "자료의 지역·대상과 확인한 영향을 함께 쓴다.",
      "모형 집 수를 실제 도시 피해 집 수로 바꾼다.",
      "모형·사례와 실제 내 관찰을 구별한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "자료가 보여 주는 대상과 조건 안에서 영향을 설명해요. 모형 결과를 실제 현상 전체로 확대하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 47,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 피해 모형을 두 번 비교하려 합니다. “물높이만 다르게, 지형·집 위치는 같게”에서 바꾸는 조건을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물높이",
      "accepted": [
        "물높이",
        "물 높이"
      ]
    },
    "explanation": "바꾸는 조건은 물높이예요. 지형·집 위치·통·처음 상태·젖음 기준은 같은 비교를 위해 유지해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 48,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-02",
      "topic": "기후변화 영향·피해 모형",
      "concept": "기후변화 영향·피해 모형",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "모형의 물높이를 바꾸자 집 일부가 젖었습니다. 관찰한 결과와 그것으로는 알 수 없는 실제 지역의 내용을 나누어 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "정해 둔 모형 조건에서 물높이를 바꿨을 때 어느 집이 젖었는지 기록한다. 실제 지역은 지형·강수·시설 등 조건이 달라 이 결과만으로 실제 침수 연도·깊이·피해 집 수를 정할 수 없다.",
      "rubric": {
        "required": [
          "모형 조건·실제 관찰 결과 명시",
          "실제 지역 조건·예측 한계"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모형에서 얻은 증거와 실제 지역에 대한 추가 자료를 구별해요. 모형 결과를 실제 측정값으로 기록하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 49,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "가상 실천표에서 바로 확정할 수 없는 내용은 무엇인가요?",
    "givens": {
      "가상 실천 기록": {
        "머리": [
          "날",
          "기록"
        ],
        "행": [
          [
            "월",
            "쓰지 않는 조명 끄기 실천"
          ],
          [
            "화",
            "쓰지 않는 조명 끄기 실천"
          ],
          [
            "수",
            "실천 못함"
          ],
          [
            "목",
            "쓰지 않는 조명 끄기 실천"
          ],
          [
            "금",
            "실천 계획만 세움"
          ]
        ],
        "caption": "가상 실천 기록"
      }
    },
    "choices": [
      "각 날짜에 실제로 했다고 기록한 행동의 내용",
      "실제 실천과 달리 계획으로 남겨 둔 행동",
      "실제로 했다고 적은 날짜의 수",
      "아직 실천하지 못했다고 적은 날",
      "그 행동으로 지구 평균 기온이 줄어든 값"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "행동 기록만으로 지구 기온 감소량을 측정한 것은 아니에요. 날짜·행동·미실행은 기록에 있는 내용을 읽을 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 50,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "기후변화 대응 활동을 검토할 때 타당한 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "실제 행동·못한 날과 받은 의견을 나누어 기록한다.",
      "실천이 어려운 여건과 공동 도움을 함께 살핀다.",
      "건강과 안전을 무시하고 모든 참여를 강제한다.",
      "계획한 횟수를 실제 효과 측정값으로 바꿔 적는다.",
      "안내문 저장만으로 전달과 의견 수신을 완료한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "실행 조건과 안전·참여 여건을 살피며 공동 대응을 생각해요. 실제 기록과 계획·효과 실측을 섞지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 51,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "공유 기록이 “게시물 저장, 친구에게 실제 전달, 의견은 아직 못 받음”입니다. 의견을 받은 횟수만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "0",
      "accepted": [
        "0"
      ]
    },
    "explanation": "전달은 했지만 의견은 아직 받지 않았어요. 저장·전달을 의견 수신 횟수에 더하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-fin-f2-52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 52,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-2",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03",
      "topic": "기후변화 대응 조사·실천",
      "concept": "기후변화 대응 조사·실천",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "기후변화 대응 계획의 일부만 실천했고 의견을 받아 내용을 바꿨습니다. 실행·미실행·공유·수정·재공유 상태를 어떻게 남길지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "계획한 일 중 실제 한 날짜·행동과 못한 일·사유를 나눈다. 실제 전달한 상대·방법과 받은 의견·바꾼 내용을 적고, 재공유는 실제 전달했는지 아직 계획인지 구별한다.",
      "rubric": {
        "required": [
          "실천과 미실행 사실 기록",
          "공유·의견·수정·재공유 실제 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "일부 실천을 전체 완료로 바꾸지 않아요. 받은 의견을 반영했다는 사실과 다시 전달했다는 사실도 따로 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  }
];
export {assessment42BankPaperHtml as bankPaper,wireAssessment42BankPaper as wireBankPaper} from '../../v2/assessment42-bank-paper.js';
