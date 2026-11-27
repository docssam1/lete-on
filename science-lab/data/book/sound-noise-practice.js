export const SOUND_NOISE_PRACTICE_VERSION="20261115-sound-noise-practice";
export const SOUND_NOISE_MISCONCEPTIONS={
  "SN_SOURCE": {
    "label": "소리가 나는 곳에서 줄여요",
    "element": "E8",
    "terms": [
      "소음",
      "문",
      "의자"
    ],
    "fix": "문을 천천히 닫거나 의자 다리에 알맞은 덮개를 쓰면 소리가 나는 곳에서 소음을 줄일 수 있어요. 다른 소리를 크게 내어 덮는 방법과 구별해요."
  },
  "SN_COMPARE": {
    "label": "같은 조건에서 전후를 비교해요",
    "element": "E8",
    "terms": [
      "소음",
      "비교",
      "조건"
    ],
    "fix": "같은 의자·바닥·듣는 자리를 유지하고 줄이는 방법을 쓰기 전과 후를 비교해요. 비교한 조건에서 알게 된 것만 설명해요."
  },
  "SN_PATH": {
    "label": "소리가 들어오는 길을 살펴요",
    "element": "E8",
    "terms": [
      "소음",
      "문",
      "전달"
    ],
    "fix": "문을 열었을 때와 닫았을 때 같은 자리에서 들리는 소리를 비교해요. 소리가 나는 곳의 소리와 교실 안으로 들어와 들리는 소리를 구별해요."
  },
  "SN_CONTEXT": {
    "label": "누가 언제 듣는지 생각해요",
    "element": "E8",
    "terms": [
      "소음",
      "상황",
      "알림"
    ],
    "fix": "같은 소리도 듣는 시간과 하는 일에 따라 다르게 느낄 수 있어요. 필요한 안전 알림은 듣고, 공부나 휴식을 방해하는 소리는 상황에 맞게 줄여요."
  },
  "SN_WORD": {
    "label": "생활을 방해하는 소음을 구별해요",
    "element": "E8",
    "terms": [
      "소음",
      "세기",
      "높낮이"
    ],
    "fix": "책 읽기나 쉬는 일을 방해하여 불편하게 느끼는 소리를 소음이라고 해요. 높은 소리나 큰 소리가 모두 소음이라는 뜻은 아니에요."
  }
};
const patches={
  "c22-s32-u03-b57": {
    "previous": {
      "id": "c22-s32-u03-b57",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "앞으로 할 계획으로 표시해야 할 기록은 무엇인가요?",
      "givens": null,
      "choices": [
        "실천 뒤 받은 질문을 날짜와 적었다.",
        "실제로 고친 행동과 까닭을 기록했다.",
        "오늘 문을 살살 닫고 결과를 기록했다.",
        "내일 문을 살살 닫아 비교할 예정이다.",
        "확인한 소리의 차이를 그대로 남겼다."
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 3,
        "accepted": [
          3
        ]
      },
      "explanation": "내일 하겠다는 내용은 계획이에요. 실제 실행 날짜와 결과가 있는 기록과 구별해요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      }
    },
    "fields": {
      "prompt": "문을 닫을 때 나는 소리가 친구의 발표를 방해해요. 소리가 나는 곳에서 줄이는 방법을 고르세요.",
      "choices": [
        "문 닫는 소리를 덮으려고 음악을 크게 튼다.",
        "친구가 발표하는 목소리를 더 크게 낸다.",
        "문을 더 세게 밀어 빠르게 닫는다.",
        "손잡이를 잡고 문을 천천히 닫는다.",
        "문소리와 함께 책상을 계속 두드린다."
      ],
      "explanation": "문을 천천히 닫으면 세게 닫을 때보다 부딪치는 소리를 줄일 수 있어요. 음악이나 발표 소리를 키우는 것은 문이 부딪치는 소리를 줄이는 방법이 아니에요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": "SN_SOURCE",
    "feedback": false
  },
  "c22-s32-u03-b58": {
    "previous": {
      "id": "c22-s32-u03-b58",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "실천 기록을 저장했다는 것만으로 알 수 없는 것을 고르세요.",
      "givens": null,
      "choices": [
        "사용자가 입력한 계획의 내용",
        "모두가 불편하지 않게 됐다는 결론",
        "사용자가 적은 실제 의견의 문장",
        "사용자가 구별한 계획·실천 상태",
        "사용자가 쓴 활동 날짜"
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 1,
        "accepted": [
          1
        ]
      },
      "explanation": "기록 저장은 입력한 내용을 보관하는 기능이에요. 실제 수행이나 모두의 만족·공식 성적이 자동으로 검증되는 것은 아니에요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      },
      "contentVersion": "20261108-grade3-practice-language",
      "previousVersions": [
        {
          "id": "c22-s32-u03-b58",
          "status": "authored",
          "sourceRef": {
            "type": "authored-supplement",
            "edition": "GFIELD 소리의 성질 보충",
            "course": "초등3-2"
          },
          "taxonomy": {
            "curriculum": "2022 개정",
            "grade": 3,
            "semester": 2,
            "unit": "u03",
            "area": "운동과 에너지",
            "element": "E8",
            "type": "T21",
            "topic": "실제 실천·의견·수정 기록",
            "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
            "inquirySkill": "실제 기록·소통·수정",
            "format": "선택형",
            "level": "기본",
            "track": "교과",
            "standard": "4과07-03"
          },
          "prompt": "실천을 보관한 것만으로 확정할 수 없는 것은 무엇인가요?",
          "givens": null,
          "choices": [
            "사용자가 입력한 계획의 내용",
            "모두가 불편하지 않게 됐다는 결론",
            "사용자가 적은 실제 의견의 문장",
            "사용자가 구별한 계획·실천 상태",
            "사용자가 쓴 활동 날짜"
          ],
          "responseContract": "single-choice",
          "answerContract": {
            "type": "single-choice",
            "answer": 1,
            "accepted": [
              1
            ]
          },
          "explanation": "기록 저장은 입력한 내용을 보관하는 기능이에요. 실제 수행이나 모두의 만족·공식 성적이 자동으로 검증되는 것은 아니에요.",
          "evidence": {
            "checkedBy": "창작 문항 검수",
            "date": "2026-10-17",
            "gates": [
              "science",
              "answer"
            ],
            "against": "교육부 성취기준과 확인한 이론·실험 본문",
            "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
          },
          "version": 1
        }
      ]
    },
    "fields": {
      "prompt": "같은 의자를 같은 바닥에서 움직이며 같은 자리에서 들은 연습용 자료예요. 표로 알 수 있는 것을 고르세요.",
      "givens": {
        "표": {
          "머리": [
            "의자 다리의 덮개",
            "들리는 의자 소리"
          ],
          "행": [
            [
              "없음",
              "더 크게 들림"
            ],
            [
              "있음",
              "더 작게 들림"
            ]
          ]
        },
        "안내": "비교 방법을 생각해 보는 학습용 자료예요."
      },
      "choices": [
        "덮개를 쓰면 어느 곳에서도 모든 소리가 사라진다.",
        "이 비교에서는 덮개를 썼을 때 소리가 더 작게 들렸다.",
        "작게 들린 소리는 반드시 낮은 소리이기도 하다.",
        "덮개를 쓰면 다른 친구의 목소리도 모두 작아진다.",
        "소리가 작게 들렸으므로 의자는 전혀 움직이지 않았다."
      ],
      "explanation": "이 자료에서는 같은 의자에 덮개를 썼을 때 더 작게 들렸어요. 이 결과만으로 모든 곳에서 소리가 사라진다거나 소리의 높낮이까지 바뀌었다고 말할 수는 없어요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": "SN_COMPARE",
    "feedback": false
  },
  "c22-s32-u03-b59": {
    "previous": {
      "id": "c22-s32-u03-b59",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "실제 의견에 따라 제안을 고친 기록으로 알맞은 것은 무엇인가요?",
      "givens": null,
      "choices": [
        "기록을 저장해서 대화가 끝났다고 썼다.",
        "아직 만나지 않았지만 모두 좋았다고 썼다.",
        "너무 늦다는 의견을 듣고 시간을 앞당겼다.",
        "질문을 듣지 않아도 질문한 것처럼 적었다.",
        "좋은 말만 남기고 불편한 의견은 지웠다."
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 2,
        "accepted": [
          2
        ]
      },
      "explanation": "실제로 받은 의견과 바꾼 내용·까닭을 연결해요. 대화를 하지 않았다면 앞으로 물을 계획이라고 밝혀요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      }
    },
    "fields": {
      "prompt": "문을 닫는 방법에 따라 소리가 달라지는지 알아보려고 해요. 알맞은 비교 방법을 고르세요.",
      "choices": [
        "다른 문을 다른 자리에서 듣고 차이를 모두 닫는 방법 때문이라고 한다.",
        "한 번은 음악을 틀고 한 번은 끈 채 문소리를 비교한다.",
        "같은 문을 같은 자리에서 듣고 닫는 방법만 바꾸어 비교한다.",
        "천천히 닫을 때만 멀리 가서 듣고 두 소리를 비교한다.",
        "문은 닫지 않고 친구가 말한 예상만으로 결과를 정한다."
      ],
      "explanation": "같은 문을 같은 자리에서 듣고, 평소처럼 닫을 때와 천천히 닫을 때의 소리를 비교해요. 문이나 듣는 거리도 함께 바꾸면 무엇 때문에 다르게 들렸는지 알기 어려워요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": "SN_COMPARE",
    "feedback": false
  },
  "c22-s32-u03-b60": {
    "previous": {
      "id": "c22-s32-u03-b60",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "실천 뒤 예상과 다른 결과가 나왔습니다. 알맞은 기록은 무엇인가요?",
      "givens": null,
      "choices": [
        "실행 날짜를 바꾸어 성공한 날로 쓴다.",
        "불편한 의견은 자료에서 모두 지운다.",
        "실제 결과와 더 확인할 조건을 남긴다.",
        "친구가 하지 않은 말을 만들어 보탠다.",
        "성공한 예시 값으로 결과를 덮어 쓴다."
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 2,
        "accepted": [
          2
        ]
      },
      "explanation": "실제 결과를 유지하고 조건·방법을 다시 살펴요. 다른 결과도 보완 계획의 근거가 될 수 있어요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      }
    },
    "fields": {
      "prompt": "복도에서 같은 소리가 날 때 교실의 같은 자리에서 들었어요. 자료에 맞는 설명을 고르세요.",
      "givens": {
        "표": {
          "머리": [
            "교실 문의 상태",
            "교실 안에서 들리는 복도 소리"
          ],
          "행": [
            [
              "열어 둠",
              "더 크게 들림"
            ],
            [
              "닫아 둠",
              "더 작게 들림"
            ]
          ]
        },
        "안내": "소리 전달을 비교하는 학습용 자료예요."
      },
      "choices": [
        "문을 닫으면 복도에서 소리를 내는 물체도 모두 멈춘다.",
        "문을 닫으면 복도 소리의 높낮이는 반드시 낮아진다.",
        "이 비교에서는 문을 닫으니 교실 안으로 들리는 복도 소리가 줄었다.",
        "문을 닫으면 필요한 안전 알림도 없애야 한다.",
        "복도 소리가 작게 들렸으므로 교실의 공기가 없어진 것이다."
      ],
      "explanation": "같은 자리에서 비교했을 때 문을 닫은 쪽에서 복도 소리가 더 작게 들렸어요. 복도에서 소리 자체가 나지 않게 된 것이 아니라 교실 안으로 들어와 들리는 소리가 줄어든 거예요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": "SN_PATH",
    "feedback": false
  },
  "c22-s32-u03-b61": {
    "previous": {
      "id": "c22-s32-u03-b61",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "소음을 줄여 본 결과를 친구에게 설명하려고 해요. 어떤 기록이 필요할까요?",
      "givens": null,
      "choices": [
        "친구 이름을 많이 나열한 목록",
        "기록 파일이 있다는 사실만 쓴 표",
        "예시 답의 문장을 그대로 옮긴 글",
        "앞으로 할 계획을 완료로 바꾼 표시",
        "실제 장소·행동·결과·의견의 기록"
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 4,
        "accepted": [
          4
        ]
      },
      "explanation": "언제 어디서 무엇을 했고 어떤 결과·의견을 확인했는지 설명해요. 계획과 예시를 실제 수행 근거로 바꾸지 않아요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      },
      "contentVersion": "20261108-grade3-practice-language",
      "previousVersions": [
        {
          "id": "c22-s32-u03-b61",
          "status": "authored",
          "sourceRef": {
            "type": "authored-supplement",
            "edition": "GFIELD 소리의 성질 보충",
            "course": "초등3-2"
          },
          "taxonomy": {
            "curriculum": "2022 개정",
            "grade": 3,
            "semester": 2,
            "unit": "u03",
            "area": "운동과 에너지",
            "element": "E8",
            "type": "T21",
            "topic": "실제 실천·의견·수정 기록",
            "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
            "inquirySkill": "실제 기록·소통·수정",
            "format": "선택형",
            "level": "기본",
            "track": "교과",
            "standard": "4과07-03"
          },
          "prompt": "다른 사람에게 실천 결과를 설명할 때 필요한 근거는 무엇인가요?",
          "givens": null,
          "choices": [
            "친구 이름을 많이 나열한 목록",
            "기록 파일이 있다는 사실만 쓴 표",
            "예시 답의 문장을 그대로 옮긴 글",
            "앞으로 할 계획을 완료로 바꾼 표시",
            "실제 장소·행동·결과·의견의 기록"
          ],
          "responseContract": "single-choice",
          "answerContract": {
            "type": "single-choice",
            "answer": 4,
            "accepted": [
              4
            ]
          },
          "explanation": "언제 어디서 무엇을 했고 어떤 결과·의견을 확인했는지 설명해요. 계획과 예시를 실제 수행 근거로 바꾸지 않아요.",
          "evidence": {
            "checkedBy": "창작 문항 검수",
            "date": "2026-10-17",
            "gates": [
              "science",
              "answer"
            ],
            "against": "교육부 성취기준과 확인한 이론·실험 본문",
            "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
          },
          "version": 1
        }
      ]
    },
    "fields": {
      "prompt": "같은 음악을 들어도 음악 시간에는 즐겁고, 조용히 책을 읽을 때는 방해가 될 수 있어요. 알맞은 설명을 고르세요.",
      "choices": [
        "좋아하는 음악은 언제 들어도 누구에게나 방해가 되지 않는다.",
        "높은 음이 있는 음악은 어느 때나 모두 나쁜 소리다.",
        "작게 들리는 음악은 어떤 활동도 방해할 수 없다.",
        "음악을 듣는 사람의 수만 같으면 느끼는 점도 같다.",
        "소리를 듣는 때와 그때 하는 일을 함께 생각해야 한다."
      ],
      "explanation": "같은 음악도 듣는 시간과 하는 일에 따라 다르게 느껴질 수 있어요. 음악 소리 자체를 모두 없애기보다 듣는 사람과 상황에 맞게 소리의 크기나 시간을 조절해요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": "SN_CONTEXT",
    "feedback": false
  },
  "c22-s32-u03-b62": {
    "previous": {
      "id": "c22-s32-u03-b62",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "계획과 실제 실천을 구별한 기록을 고르세요. (정답 2개)",
      "givens": null,
      "choices": [
        "실행 뒤 날짜와 실제 결과를 따로 적는다.",
        "저장 버튼을 누르면 실천 완료로 바꾼다.",
        "직접 보지 못한 결과도 관찰했다고 채운다.",
        "발표 자료를 쓰면 실제 의견도 들은 셈이다.",
        "아직 안 한 활동은 계획 상태로 남긴다."
      ],
      "responseContract": "multi-choice",
      "answerContract": {
        "type": "multi-choice",
        "answers": [
          0,
          4
        ]
      },
      "explanation": "활동의 상태·날짜·실제 결과를 구별해요. 자료 작성과 저장은 실제 실천·소통을 대신하지 않아요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      }
    },
    "fields": {
      "prompt": "의자 소음을 줄이고 도움이 되었는지 알아보려고 해요. 알맞은 방법 두 가지를 고르세요. (정답 2개)",
      "choices": [
        "의자 다리에 알맞은 덮개를 씌운다.",
        "조용하게 하려고 같은 의자를 더 세게 끈다.",
        "의자 소리를 덮으려고 옆에서 북을 친다.",
        "의자 소리가 들리면 학교의 안전 안내 방송을 끈다.",
        "같은 자리에서 덮개를 쓰기 전후의 의자 소리를 비교한다."
      ],
      "explanation": "의자 다리에 알맞은 덮개를 쓰고, 같은 의자·바닥·듣는 자리에서 전후 소리를 비교해요. 다른 소리를 크게 내거나 필요한 안전 안내를 끄는 것은 의자 소음을 줄이는 방법이 아니에요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": "SN_SOURCE",
    "feedback": false
  },
  "c22-s32-u03-b63": {
    "previous": {
      "id": "c22-s32-u03-b63",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "단답형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "실제로 실행하기 전에 앞으로 할 방법을 정한 것은 무엇인가요?",
      "givens": null,
      "choices": null,
      "responseContract": "short-text",
      "answerContract": {
        "type": "short-text",
        "answer": "계획",
        "accepted": [
          "계획",
          "실천 계획",
          "활동 계획"
        ]
      },
      "explanation": "계획은 앞으로 할 일을 정한 것이며 실행 뒤의 실제 결과와 구별해요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      }
    },
    "fields": {
      "prompt": "책을 읽는데 옆에서 크게 틀어 놓은 음악 때문에 방해가 되고 불편해요. 이처럼 생활에 방해가 되어 줄이려는 소리를 무엇이라고 하나요?",
      "answerContract": {
        "type": "short-text",
        "answer": "소음",
        "accepted": [
          "소음"
        ],
        "vocabulary": [
          "소음",
          "계획",
          "실천 계획",
          "활동 계획"
        ]
      },
      "explanation": "듣는 사람에게 불편함을 주거나 활동을 방해하는 소리를 소음이라고 해요. 같은 음악도 상황에 따라 소음으로 느껴질 수 있어요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "단답형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": "SN_WORD",
    "feedback": false
  },
  "c22-s32-u03-t04": {
    "previous": {
      "id": "c22-s32-u03-t04",
      "status": "authored",
      "prompt": "소리는 공기 같은 기체뿐 아니라 물 같은 ( ① )와 철 같은 ( ② )를 통해서도 전달돼요.",
      "givens": null,
      "choices": null,
      "responseContract": "cloze",
      "answerContract": {
        "type": "cloze",
        "blanks": [
          {
            "answer": "액체",
            "accepted": [
              "액체"
            ]
          },
          {
            "answer": "고체",
            "accepted": [
              "고체"
            ]
          }
        ]
      },
      "explanation": "물속에서도 소리가 들리고, 철봉에 귀를 대면 두드리는 소리가 들려요.",
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T07",
        "standard": "4과07-03",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "topic": "고체·액체·기체를 통한 전달",
        "concept": "고체·액체·기체를 통한 전달",
        "inquirySkill": "고체·액체·기체를 통한 전달"
      },
      "sourceRef": {
        "type": "authored-lesson",
        "edition": "2022 개정 사고력 수업",
        "note": "사고력 수업(예상→모형→개념→적용)의 창작 문항. 모형 수치는 모형 값이며 실제 측정·학생 수행 기록이 아님."
      },
      "visualModel": null,
      "variantRules": null,
      "evidence": {
        "checkedBy": "Claude",
        "date": "2026-10-19",
        "gates": [
          "curriculum-2022",
          "science",
          "answer",
          "choice-length"
        ]
      }
    },
    "fields": {
      "explanation": "소리는 공기뿐 아니라 액체인 물과 고체인 철을 통해서도 전달돼요.",
      "evidence": {
        "checkedBy": "Claude",
        "date": "2026-11-15",
        "gates": [
          "curriculum-2022",
          "science",
          "answer",
          "choice-length"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "소리 전달의 관찰 현상에 맞춰 설명을 검토하고 직접 큰 소리에 귀를 가까이 대는 안내를 사용하지 않는다."
      }
    },
    "code": null,
    "feedback": true
  },
  "c22-s32-u03-t10": {
    "previous": {
      "id": "c22-s32-u03-t10",
      "status": "authored",
      "prompt": "실 전화기로 친구 목소리가 들리는 까닭으로 알맞은 것은?",
      "givens": null,
      "choices": [
        "친구 목소리가 공기로만 전해져서",
        "실이 소리를 크게 만들어 줘서",
        "종이컵이 소리를 새로 만들어서",
        "실이 느슨해야 소리가 잘 나서",
        "팽팽한 실을 따라 떨림이 전해져서"
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 4,
        "accepted": [
          4
        ]
      },
      "explanation": "종이컵의 떨림이 팽팽한 실(고체)을 따라 전해져요. 실을 손으로 잡으면 떨림이 멈춰 잘 들리지 않아요.",
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E4",
        "type": "T09",
        "standard": "4과07-03",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "topic": "실 전화기와 소리의 전달",
        "concept": "실 전화기와 소리의 전달",
        "inquirySkill": "실 전화기와 소리의 전달"
      },
      "sourceRef": {
        "type": "authored-lesson",
        "edition": "2022 개정 사고력 수업",
        "note": "사고력 수업(예상→모형→개념→적용)의 창작 문항. 모형 수치는 모형 값이며 실제 측정·학생 수행 기록이 아님."
      },
      "visualModel": null,
      "variantRules": null,
      "evidence": {
        "checkedBy": "Claude",
        "date": "2026-10-19",
        "gates": [
          "curriculum-2022",
          "science",
          "answer",
          "choice-length"
        ]
      }
    },
    "fields": {
      "explanation": "실 전화기는 종이컵과 팽팽한 실을 통해 소리를 전해요. 실을 손으로 잡으면 떨림이 줄어 소리가 덜 또렷하게 들릴 수 있어요. 같은 목소리와 듣는 자리에서 비교해요.",
      "evidence": {
        "checkedBy": "Claude",
        "date": "2026-11-15",
        "gates": [
          "curriculum-2022",
          "science",
          "answer",
          "choice-length"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "소리 전달의 관찰 현상에 맞춰 설명을 검토하고 직접 큰 소리에 귀를 가까이 대는 안내를 사용하지 않는다."
      }
    },
    "code": null,
    "feedback": true
  },
  "c22-s32-u03-b64": {
    "previous": {
      "id": "c22-s32-u03-b64",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 소리의 성질 보충",
        "course": "초등3-2"
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "실제 실천·의견·수정 기록",
        "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
        "inquirySkill": "실제 기록·소통·수정",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      },
      "prompt": "소음 줄이기를 실제로 한 뒤 소개하려고 해요. 기록표에 넣을 내용을 쓰세요. 아직 하지 않은 일은 어떻게 표시할지도 쓰세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
        "type": "written-explanation",
        "sample": "날짜·장소·바꾼 행동·실제 결과·받은 의견·고칠 점을 적는 칸을 만들어요. 아직 실행하지 않았다면 계획이라고 표시하고 관찰값이나 대화를 만들지 않아요.",
        "rubric": {
          "required": [
            "실제 수행과 근거를 남길 타당한 항목",
            "미실행 계획·실제 결과의 구별"
          ],
          "criteria": [
            "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
          ],
          "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
        }
      },
      "explanation": "실제로 한 날짜·장소·행동·관찰 결과와 받은 의견을 나누어 적고 수정한 까닭을 연결해요. 실행 전 계획과 실행 뒤 기록을 구별하며 실제로 확인하지 않은 값이나 대화를 채우지 않아요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준과 확인한 이론·실험 본문",
        "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
      },
      "contentVersion": "20261108-grade3-practice-language",
      "previousVersions": [
        {
          "id": "c22-s32-u03-b64",
          "status": "authored",
          "sourceRef": {
            "type": "authored-supplement",
            "edition": "GFIELD 소리의 성질 보충",
            "course": "초등3-2"
          },
          "taxonomy": {
            "curriculum": "2022 개정",
            "grade": 3,
            "semester": 2,
            "unit": "u03",
            "area": "운동과 에너지",
            "element": "E8",
            "type": "T21",
            "topic": "실제 실천·의견·수정 기록",
            "concept": "계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.",
            "inquirySkill": "실제 기록·소통·수정",
            "format": "서술형",
            "level": "기본",
            "track": "교과",
            "standard": "4과07-03"
          },
          "prompt": "소음 줄이기를 실제로 한 뒤 소개할 기록 양식을 제안해 보세요. 아직 하지 않았을 때의 표시 방법도 넣어 보세요.",
          "givens": null,
          "choices": null,
          "responseContract": "written-explanation",
          "answerContract": {
            "type": "written-explanation",
            "sample": "날짜·장소·바꾼 행동·실제 결과·받은 의견·고칠 점을 적는 칸을 만들어요. 아직 실행하지 않았다면 계획이라고 표시하고 관찰값이나 대화를 만들지 않아요.",
            "rubric": {
              "required": [
                "실제 수행과 근거를 남길 타당한 항목",
                "미실행 계획·실제 결과의 구별"
              ],
              "criteria": [
                "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
              ],
              "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
            }
          },
          "explanation": "실제로 한 날짜·장소·행동·관찰 결과와 받은 의견을 나누어 적고 수정한 까닭을 연결해요. 실행 전 계획과 실행 뒤 기록을 구별하며 실제로 확인하지 않은 값이나 대화를 채우지 않아요.",
          "evidence": {
            "checkedBy": "창작 문항 검수",
            "date": "2026-10-17",
            "gates": [
              "science",
              "answer"
            ],
            "against": "교육부 성취기준과 확인한 이론·실험 본문",
            "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
          },
          "version": 1
        }
      ]
    },
    "fields": {
      "prompt": "책을 읽는 교실에서 의자를 끄는 소리가 불편해요. 소음을 줄일 방법 한 가지와, 도움이 되었는지 알아볼 비교 방법을 쓰세요.",
      "answerContract": {
        "type": "written-explanation",
        "reviewRequired": true,
        "sample": "의자 다리에 알맞은 덮개를 씌워요. 같은 의자를 같은 바닥에서 움직이며 같은 자리에서 덮개를 쓰기 전후의 소리를 비교해요.",
        "rubric": {
          "required": [
            "상황에 맞는 소음 줄이기 방법",
            "같은 조건에서 전후 소리를 비교하는 방법"
          ],
          "criteria": [
            "여러 타당한 방법과 같은 뜻의 설명을 인정해요."
          ],
          "pass": "소음을 줄일 방법과 그 효과를 알아볼 비교가 이어지는지 선생님과 확인해요."
        }
      },
      "explanation": "의자를 안전하게 들어 옮기거나 다리에 알맞은 덮개를 쓸 수 있어요. 같은 장소와 듣는 자리에서 방법을 쓰기 전후의 소리를 비교하면 도움이 되었는지 알아볼 수 있어요.",
      "evidence": {
        "checkedBy": "창작 문항 검수",
        "date": "2026-11-15",
        "gates": [
          "science",
          "answer"
        ],
        "against": "2022 개정4과07-03·생활 속 소음 줄이기와 조건 비교",
        "note": "기록 앱 사용법 대신 소음 문제 해결을 묻는 창작 학습 문항이며 표는 학습용 자료다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 3,
        "semester": 2,
        "unit": "u03",
        "area": "운동과 에너지",
        "element": "E8",
        "type": "T21",
        "topic": "생활 속 소음 줄이기",
        "concept": "소음을 줄이는 방법을 찾아 같은 조건에서 효과를 비교하고 듣는 상황을 고려한다.",
        "inquirySkill": "소음 문제 해결·비교",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "4과07-03"
      }
    },
    "code": null,
    "feedback": false
  }
};
const clone=x=>JSON.parse(JSON.stringify(x)),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),cache=new WeakMap();
export function soundNoisePracticeReview(rows,unit){
 if(unit!=='c22-s32-u03'||!Array.isArray(rows))return rows;
 let changed=false;const next=rows.map(q=>{
  const p=patches[q.id];if(!p||!same(q,p.previous))return q;
  changed=true;if(cache.has(q))return cache.get(q);
  if(p.feedback){const current={...q,...clone(p.fields),contentVersion:SOUND_NOISE_PRACTICE_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};cache.set(q,current);return current;}
  const fields=clone(p.fields),ac=fields.answerContract||q.answerContract;
  const diagnosticOverride={version:SOUND_NOISE_PRACTICE_VERSION,distractors:null,typed:null,cloze:null,cells:null};
  if(p.code&&q.choices){const correct=ac.type==='single-choice'?[ac.answer]:ac.answers;diagnosticOverride.distractors=Object.fromEntries(q.choices.flatMap((_,i)=>correct.includes(i)?[]:[[i,p.code]]));}
  if(q.id==='c22-s32-u03-b62')diagnosticOverride.distractors[3]='SN_CONTEXT';
  if(p.code&&ac.type==='short-text')diagnosticOverride.typed={any:p.code};
  const current={...q,...fields,contentVersion:SOUND_NOISE_PRACTICE_VERSION,diagnosticOverride,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });return changed?next:rows;
}
export function withSoundNoiseContext(mod,unit){
 if(unit!=='c22-s32-u03')return mod;
 const misc=mod.misc,types=mod.taxonomy?.types;
 return{...mod,misc:{...misc,misconceptions:{...misc.misconceptions,...clone(SOUND_NOISE_MISCONCEPTIONS)}},taxonomy:{...mod.taxonomy,types:types.map(t=>t.id==='T21'?{...t,name:'생활 속 소음 줄이기',desc:'소음을 줄이는 방법과 효과를 비교하고 듣는 상황을 고려한다.'}:t)}};
}
