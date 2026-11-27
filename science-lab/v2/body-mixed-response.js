// Use brief responses for organ functions and pathways; retain real observations and models.
export const BODY_MIXED_VERSION='20261124-body-mixed-responses';
const unit='c22-s51-u04',prior='6c0a80d6a56d0c1c';
const review={
  "4": {
    "prompt": "걷기 전과 후의 맥박을 비교해요. 두 번 모두 (1)[ ] 시간 동안 세어요. 보기: 같은·다른",
    "answer": "같은",
    "explanation": "같은 사람의 맥박을 같은 시간 동안 세어 비교해요. 이 관찰만으로 건강 상태를 판정하지 않아요.",
    "misconception": "관찰한 시간이 다른 횟수를 그대로 비교하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같은",
            "동일한",
            "똑같은"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "215e0a9f44b3de6d"
  },
  "10": {
    "answer": "안쪽 근육이 수축해 뼈를 당겨요.",
    "explanation": "손으로 막대를 움직여 용수철 길이가 바뀐 모형과 실제 근육이 수축해 뼈를 당기는 작용을 구별해요.",
    "misconception": "팔이 먼저 굽혀져 근육이 수축한다고 원인과 결과를 거꾸로 설명하지 않아요.",
    "prompt": "모형에서는 손으로 막대를 먼저 굽혔어요. 실제 팔에서는 근육과 뼈가 어떻게 움직일까요? 짧게 쓰세요.",
    "required": [
      "실제 팔에서는 근육이 수축해 뼈를 당긴다는 설명"
    ],
    "lines": 1,
    "before": "2f5951d32ecfa439"
  },
  "16": {
    "prompt": "작은창자 안쪽에 작은 돌기들이 많아요. 영양소를 흡수하는 데 도움이 되는 까닭을 고르세요.",
    "answer": "①",
    "explanation": "작은 돌기들은 음식물과 닿는 면적을 넓혀 영양소 흡수를 도와요. 작은창자의 생김새와 하는 일을 연결해요.",
    "misconception": "작은 돌기가 음식물을 혈액 대신 온몸으로 운반한다고 설명하지 않아요.",
    "form": "choice",
    "choices": [
      "음식물과 닿는 면적이 넓어져서",
      "음식물이 작은창자를 전혀 지나지 않아서",
      "작은창자가 직접 산소를 받아들이게 해서"
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "cf717f61415faa8b"
  },
  "39": {
    "prompt": "운동할 때 산소를 받아들이는 것은 (1)[ ] 기관이고, 혈액으로 산소를 온몸에 운반하는 것은 (2)[ ] 기관이에요. 보기: 호흡·순환",
    "answer": "호흡 / 순환",
    "explanation": "호흡 기관에서 받아들인 산소를 혈액이 온몸으로 운반해요. 호흡 기관과 순환 기관은 서로 관련되어 일해요.",
    "misconception": "폐에서 받아들인 산소가 혈액의 운반 없이 온몸에 바로 간다고 설명하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "호흡",
            "호흡 기관",
            "호흡기관"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "순환",
            "순환 기관",
            "순환기관"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "df2a14e70241db01"
  },
  "40": {
    "prompt": "두 친구가 서로 다른 시간 동안 맥박을 셌어요. 횟수를 비교하려면 관찰 시간을 (1)[ ] 맞추어 다시 세어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "센 시간이 다르면 횟수만 바로 비교하기 어려워요. 같은 시간 동안 센 기록으로 비교해요.",
    "misconception": "시간과 활동 조건이 다른 횟수로 더 건강한 친구를 정하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "동일하게",
            "똑같게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "3b8b11cf306085c1"
  },
  "48": {
    "prompt": "펌프를 한 번 누를 때 옮기는 물의 양은 같아요. 10초 동안 누른 횟수가 늘면 그동안 옮긴 전체 물의 양은 어떻게 될까요?",
    "answer": "③",
    "explanation": "한 번에 옮기는 양이 같다면 같은 시간에 더 많이 누를수록 전체 옮긴 물의 양이 늘어요. 이 모형만으로 실제 사람의 심장이 내보내는 혈액량을 구한 것은 아니에요.",
    "misconception": "같은 시간의 전체 양과 한 번에 옮기는 양을 구별해요.",
    "form": "choice",
    "choices": [
      "반드시 줄어든다.",
      "변하지 않는다.",
      "늘어난다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "56cf259ef4687d78"
  },
  "54": {
    "prompt": "폐에서 받아들인 산소와 작은창자에서 흡수한 영양소는 모두 (1)[ ]을 통해 온몸으로 운반돼요. 보기: 혈액·음식물",
    "answer": "혈액",
    "explanation": "폐의 산소와 작은창자의 영양소는 혈액으로 옮겨져 온몸에 공급돼요. 음식물이 그대로 혈관을 지나는 것은 아니에요.",
    "misconception": "호흡·소화에서 얻은 물질과 혈액의 운반을 연결해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "혈액",
            "피"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "be6e994943634003"
  },
  "56": {
    "prompt": "예방법 소개 자료를 만들었지만 아직 친구에게 보여 주지 않았어요. 다음에 할 일을 고르세요.",
    "answer": "②",
    "explanation": "자료를 실제로 보여 주고 설명해요. 친구의 질문을 듣고 관련 기관과 예방 행동의 연결을 보충해요.",
    "misconception": "자료를 저장한 일과 친구에게 소개한 일을 구별해요.",
    "form": "choice",
    "choices": [
      "자료를 저장하고 소개까지 끝났다고 적는다.",
      "친구에게 자료를 보여 주고 예방법을 설명한다.",
      "친구가 한 적 없는 질문을 실제 질문처럼 적는다."
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "a0d4635a56a0c1d4"
  },
  "68": {
    "prompt": "팔을 굽힐 때는 (1)[ ] 근육이, 펼 때는 (2)[ ] 근육이 수축해요. 보기: 안쪽·바깥쪽",
    "answer": "안쪽 / 바깥쪽",
    "explanation": "팔을 굽힐 때 안쪽 근육이, 펼 때 바깥쪽 근육이 수축해 뼈를 당겨요. 근육이 뼈를 밀어 움직인다고 하지 않아요.",
    "misconception": "뼈 자체가 짧아지거나 근육이 뼈를 밀어 편다고 설명하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "안쪽",
            "안쪽 근육",
            "안쪽근육"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "바깥쪽",
            "바깥쪽 근육",
            "바깥쪽근육"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "7aee24e0b1570bbe"
  },
  "72": {
    "prompt": "콩팥에서 만들어진 오줌이 방광까지 가는 길을 완성하세요. 콩팥 → (1)[ ] → 방광. 보기: 오줌관·식도",
    "answer": "오줌관",
    "explanation": "콩팥에서 만들어진 오줌은 오줌관을 따라 방광에 모여요. 혈액이 콩팥에 도착하는 길과 오줌이 나가는 길은 달라요.",
    "misconception": "음식물이 지나는 길과 콩팥에서 만들어진 오줌의 길을 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "오줌관",
            "요관"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "357593145927fc1e"
  },
  "76": {
    "prompt": "같은 사람의 맥박을 30초씩 세니 걷기 전 36회, 직후 45회였어요. 같은 30초 동안 몇 회 늘었나요?",
    "answer": "9회",
    "explanation": "45−36=9이므로 이 기록에서는 같은30초 동안9회 늘었어요. 다른 사람의 정상값이나 건강 판정으로 바꾸지 않아요.",
    "misconception": "제시된 비교 값을 모든 사람의 정상 맥박 수로 여기지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "9",
        "9회",
        "9 회",
        "아홉 회",
        "아홉회"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "dd0084c04c09ab42"
  },
  "80": {
    "prompt": "작은창자에서 흡수한 영양소를 근육까지 운반하는 것은 (1)[ ]이에요. 보기: 혈액·식도",
    "answer": "혈액",
    "explanation": "작은창자에서 흡수한 영양소는 혈액을 통해 근육 등 온몸에 공급돼요. 식도는 음식물이 지나는 소화 기관의 일부예요.",
    "misconception": "작은창자가 영양소를 혈액 대신 온몸으로 직접 운반한다고 여기지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "혈액",
            "피"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "955361bf5a4ae6f1"
  },
  "88": {
    "prompt": "친구가 “사흘 손을 씻었으니 앞으로 절대로 장염에 걸리지 않아.”라고 말했어요. 알맞게 고친 설명을 고르세요.",
    "answer": "①",
    "explanation": "손씻기는 감염 위험을 줄이는 생활 습관이에요. 며칠 실천했다는 이유로 앞으로의 감염을 완전히 막는다고 하지는 않아요.",
    "misconception": "예방에 도움이 된다는 말과 절대 걸리지 않는다는 말을 구별해요.",
    "form": "choice",
    "choices": [
      "손씻기는 감염 위험을 줄이는 데 도움이 되지만 완전히 막는 것은 아니다.",
      "손을 사흘 씻으면 그 뒤에는 손을 씻지 않아도 된다.",
      "손을 씻으면 모든 질병이 반드시 치료된다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "2dbc63afcf81b3dd"
  },
  "92": {
    "prompt": "호흡 모형의 아래 막을 당기자 풍선이 커졌어요. 풍선 안으로 들어온 것은 무엇일까요?",
    "answer": "공기",
    "explanation": "아래 막을 당기자 병 안 공간이 커지고 관을 통해 풍선 안으로 공기가 들어왔어요. 실제 몸에서는 폐와 가로막이 관련되어 움직여요.",
    "misconception": "풍선이 스스로 공기를 만들어 내거나 산소만 들어온다고 여기지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "공기"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "474b0b95f779ba0f"
  },
  "95": {
    "prompt": "친구가 “어느 기관과 관련된 예방법인지 모르겠어.”라고 했어요. 소개 그림에 더할 표시를 고르세요.",
    "answer": "②",
    "explanation": "어느 기관과 관련된 행동인지 이름과 연결 표시로 보여 주어요. 친구의 질문에 맞게 자료를 고친 뒤 다시 소개해요.",
    "misconception": "배경 장식만 바꾸기보다 친구가 궁금해한 관계를 드러내요.",
    "form": "choice",
    "choices": [
      "장식 무늬만 더한다.",
      "관련 기관 이름과 예방 행동을 선으로 잇는다.",
      "기관 이름을 모두 지운다."
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "fbe5ed66f0c9281c"
  }
};
const bankReview={
  "c22-s51-u04-b004": {
    "prompt": "걷기 전과 후의 맥박을 비교해요. 두 번 모두 (1)[ ] 시간 동안 세어요. 보기: 같은·다른",
    "answer": "같은",
    "explanation": "같은 사람의 맥박을 같은 시간 동안 세어 비교해요. 이 관찰만으로 건강 상태를 판정하지 않아요.",
    "misconception": "관찰한 시간이 다른 횟수를 그대로 비교하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같은",
            "동일한",
            "똑같은"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "51ae3088a617c0a6"
    ]
  },
  "c22-s51-u04-b010": {
    "answer": "안쪽 근육이 수축해 뼈를 당겨요.",
    "explanation": "손으로 막대를 움직여 용수철 길이가 바뀐 모형과 실제 근육이 수축해 뼈를 당기는 작용을 구별해요.",
    "misconception": "팔이 먼저 굽혀져 근육이 수축한다고 원인과 결과를 거꾸로 설명하지 않아요.",
    "prompt": "모형에서는 손으로 막대를 먼저 굽혔어요. 실제 팔에서는 근육과 뼈가 어떻게 움직일까요? 짧게 쓰세요.",
    "required": [
      "실제 팔에서는 근육이 수축해 뼈를 당긴다는 설명"
    ],
    "lines": 1,
    "before": [
      "0ed4881aac2f76f4"
    ]
  },
  "c22-s51-u04-b016": {
    "prompt": "작은창자 안쪽에 작은 돌기들이 많아요. 영양소를 흡수하는 데 도움이 되는 까닭을 고르세요.",
    "answer": "①",
    "explanation": "작은 돌기들은 음식물과 닿는 면적을 넓혀 영양소 흡수를 도와요. 작은창자의 생김새와 하는 일을 연결해요.",
    "misconception": "작은 돌기가 음식물을 혈액 대신 온몸으로 운반한다고 설명하지 않아요.",
    "form": "choice",
    "choices": [
      "음식물과 닿는 면적이 넓어져서",
      "음식물이 작은창자를 전혀 지나지 않아서",
      "작은창자가 직접 산소를 받아들이게 해서"
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "618c4c9d080d97c3"
    ]
  },
  "c22-s51-u04-b039": {
    "prompt": "운동할 때 산소를 받아들이는 것은 (1)[ ] 기관이고, 혈액으로 산소를 온몸에 운반하는 것은 (2)[ ] 기관이에요. 보기: 호흡·순환",
    "answer": "호흡 / 순환",
    "explanation": "호흡 기관에서 받아들인 산소를 혈액이 온몸으로 운반해요. 호흡 기관과 순환 기관은 서로 관련되어 일해요.",
    "misconception": "폐에서 받아들인 산소가 혈액의 운반 없이 온몸에 바로 간다고 설명하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "호흡",
            "호흡 기관",
            "호흡기관"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "순환",
            "순환 기관",
            "순환기관"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "2304e1191577a4c7"
    ]
  },
  "c22-s51-u04-b040": {
    "prompt": "두 친구가 서로 다른 시간 동안 맥박을 셌어요. 횟수를 비교하려면 관찰 시간을 (1)[ ] 맞추어 다시 세어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "센 시간이 다르면 횟수만 바로 비교하기 어려워요. 같은 시간 동안 센 기록으로 비교해요.",
    "misconception": "시간과 활동 조건이 다른 횟수로 더 건강한 친구를 정하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "동일하게",
            "똑같게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "63b45bb90b461a0f"
    ]
  },
  "c22-s51-u04-b048": {
    "prompt": "펌프를 한 번 누를 때 옮기는 물의 양은 같아요. 10초 동안 누른 횟수가 늘면 그동안 옮긴 전체 물의 양은 어떻게 될까요?",
    "answer": "③",
    "explanation": "한 번에 옮기는 양이 같다면 같은 시간에 더 많이 누를수록 전체 옮긴 물의 양이 늘어요. 이 모형만으로 실제 사람의 심장이 내보내는 혈액량을 구한 것은 아니에요.",
    "misconception": "같은 시간의 전체 양과 한 번에 옮기는 양을 구별해요.",
    "form": "choice",
    "choices": [
      "반드시 줄어든다.",
      "변하지 않는다.",
      "늘어난다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "d2957dad28d8c7cb"
    ]
  },
  "c22-s51-u04-b054": {
    "prompt": "폐에서 받아들인 산소와 작은창자에서 흡수한 영양소는 모두 (1)[ ]을 통해 온몸으로 운반돼요. 보기: 혈액·음식물",
    "answer": "혈액",
    "explanation": "폐의 산소와 작은창자의 영양소는 혈액으로 옮겨져 온몸에 공급돼요. 음식물이 그대로 혈관을 지나는 것은 아니에요.",
    "misconception": "호흡·소화에서 얻은 물질과 혈액의 운반을 연결해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "혈액",
            "피"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "dd2146acf916773a"
    ]
  },
  "c22-s51-u04-b056": {
    "prompt": "예방법 소개 자료를 만들었지만 아직 친구에게 보여 주지 않았어요. 다음에 할 일을 고르세요.",
    "answer": "②",
    "explanation": "자료를 실제로 보여 주고 설명해요. 친구의 질문을 듣고 관련 기관과 예방 행동의 연결을 보충해요.",
    "misconception": "자료를 저장한 일과 친구에게 소개한 일을 구별해요.",
    "form": "choice",
    "choices": [
      "자료를 저장하고 소개까지 끝났다고 적는다.",
      "친구에게 자료를 보여 주고 예방법을 설명한다.",
      "친구가 한 적 없는 질문을 실제 질문처럼 적는다."
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "86bfe5ef90859ce9"
    ]
  },
  "c22-s51-u04-b068": {
    "prompt": "팔을 굽힐 때는 (1)[ ] 근육이, 펼 때는 (2)[ ] 근육이 수축해요. 보기: 안쪽·바깥쪽",
    "answer": "안쪽 / 바깥쪽",
    "explanation": "팔을 굽힐 때 안쪽 근육이, 펼 때 바깥쪽 근육이 수축해 뼈를 당겨요. 근육이 뼈를 밀어 움직인다고 하지 않아요.",
    "misconception": "뼈 자체가 짧아지거나 근육이 뼈를 밀어 편다고 설명하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "안쪽",
            "안쪽 근육",
            "안쪽근육"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "바깥쪽",
            "바깥쪽 근육",
            "바깥쪽근육"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "59e87ee8967c2be2"
    ]
  },
  "c22-s51-u04-b072": {
    "prompt": "콩팥에서 만들어진 오줌이 방광까지 가는 길을 완성하세요. 콩팥 → (1)[ ] → 방광. 보기: 오줌관·식도",
    "answer": "오줌관",
    "explanation": "콩팥에서 만들어진 오줌은 오줌관을 따라 방광에 모여요. 혈액이 콩팥에 도착하는 길과 오줌이 나가는 길은 달라요.",
    "misconception": "음식물이 지나는 길과 콩팥에서 만들어진 오줌의 길을 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "오줌관",
            "요관"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f8279bfe996ec88c"
    ]
  },
  "c22-s51-u04-b076": {
    "prompt": "같은 사람의 맥박을 30초씩 세니 걷기 전 36회, 직후 45회였어요. 같은 30초 동안 몇 회 늘었나요?",
    "answer": "9회",
    "explanation": "45−36=9이므로 이 기록에서는 같은30초 동안9회 늘었어요. 다른 사람의 정상값이나 건강 판정으로 바꾸지 않아요.",
    "misconception": "제시된 비교 값을 모든 사람의 정상 맥박 수로 여기지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "9",
        "9회",
        "9 회",
        "아홉 회",
        "아홉회"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c4a7c32365b684e9",
      "5e198caabfa6987c"
    ]
  },
  "c22-s51-u04-b080": {
    "prompt": "작은창자에서 흡수한 영양소를 근육까지 운반하는 것은 (1)[ ]이에요. 보기: 혈액·식도",
    "answer": "혈액",
    "explanation": "작은창자에서 흡수한 영양소는 혈액을 통해 근육 등 온몸에 공급돼요. 식도는 음식물이 지나는 소화 기관의 일부예요.",
    "misconception": "작은창자가 영양소를 혈액 대신 온몸으로 직접 운반한다고 여기지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "혈액",
            "피"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0123819a1464f6f0"
    ]
  },
  "c22-s51-u04-b088": {
    "prompt": "친구가 “사흘 손을 씻었으니 앞으로 절대로 장염에 걸리지 않아.”라고 말했어요. 알맞게 고친 설명을 고르세요.",
    "answer": "①",
    "explanation": "손씻기는 감염 위험을 줄이는 생활 습관이에요. 며칠 실천했다는 이유로 앞으로의 감염을 완전히 막는다고 하지는 않아요.",
    "misconception": "예방에 도움이 된다는 말과 절대 걸리지 않는다는 말을 구별해요.",
    "form": "choice",
    "choices": [
      "손씻기는 감염 위험을 줄이는 데 도움이 되지만 완전히 막는 것은 아니다.",
      "손을 사흘 씻으면 그 뒤에는 손을 씻지 않아도 된다.",
      "손을 씻으면 모든 질병이 반드시 치료된다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "844e3099f2512f5b"
    ]
  },
  "c22-s51-u04-b092": {
    "prompt": "호흡 모형의 아래 막을 당기자 풍선이 커졌어요. 풍선 안으로 들어온 것은 무엇일까요?",
    "answer": "공기",
    "explanation": "아래 막을 당기자 병 안 공간이 커지고 관을 통해 풍선 안으로 공기가 들어왔어요. 실제 몸에서는 폐와 가로막이 관련되어 움직여요.",
    "misconception": "풍선이 스스로 공기를 만들어 내거나 산소만 들어온다고 여기지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "공기"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c6ad4d3017663376"
    ]
  },
  "c22-s51-u04-b095": {
    "prompt": "친구가 “어느 기관과 관련된 예방법인지 모르겠어.”라고 했어요. 소개 그림에 더할 표시를 고르세요.",
    "answer": "②",
    "explanation": "어느 기관과 관련된 행동인지 이름과 연결 표시로 보여 주어요. 친구의 질문에 맞게 자료를 고친 뒤 다시 소개해요.",
    "misconception": "배경 장식만 바꾸기보다 친구가 궁금해한 관계를 드러내요.",
    "form": "choice",
    "choices": [
      "장식 무늬만 더한다.",
      "관련 기관 이름과 예방 행동을 선으로 잇는다.",
      "기관 이름을 모두 지운다."
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0a1b532e29445300"
    ]
  }
};
const questionTitles={};
const studyMethodBefore="개념과 예제를 읽고 여러 형식의 문제를 풀어요. 뼈와 근육의 모형을 만들고, 운동할 때 몸에서 일어나는 변화를 관찰해요. 오른쪽에서는 핵심을 정리하고 다음 학습의 과학 내용을 더 알아보아요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function bodyMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:BODY_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:BODY_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),bodyMixedResponse:BODY_MIXED_VERSION,contentVersion:BODY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withBodyMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=bodyMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withBodyMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),bodyMixedResponse:BODY_MIXED_VERSION,contentVersion:BODY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=e.form==='short'?'짧게 쓰기':labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'개념과 예제로 몸속 기관이 하는 일을 알아보아요. 고르기·빈칸·짧은 답으로 확인하고, 까닭은 짧게 설명해요. 뼈와 근육의 모형을 만들고 몸의 변화를 관찰하며, 조사한 예방법을 소개해요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
